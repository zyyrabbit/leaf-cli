const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const { exec } = require('child_process');
const PromptModuleAPI = require('./PromptModuleAPI');
const SSH = require('./ssh.js');
const { 
  logWithSpinner,
  succeedSpinner,
  failSpinner, 
  errorLog,
  warn,
  done,
  info
} = require('../util');

module.exports = class Deploy {
  constructor(context, promptModules) {
    // 项目目录
    this.context = context;
    // 配置文件
    this.configFile = path.join(this.context, 'deploy.config.json');
    // 项目插件选择框
    this.featurePrompt = {
      name: 'envs',
      type: 'checkbox',
      message: '请选择项目部署环境',
      choices: [],
      pageSize: 10
    };
    // 注入的选项
    this.injectedPrompts = [];
    this.promptCompleteCbs = [];
  
    const promptAPI = new PromptModuleAPI(this);
    promptModules.forEach(m => m(promptAPI));

  }

  // 初始化部署文件
  async init() {
    // 检测配置文件是否存在
    if (!fs.existsSync(this.configFile)) {
      const config = await this.promptAndResolveConfig();
      fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
      done('创建 deploy.cofnig.json 成功');
    } else {
      warn('deploy.config.json 配置文件已存在');
    }
  }

  // 执行部署函数
  async run(env) {
    const deployConfig = this.getDeployConfig(env);
    try {
      // 密码文件处理
      await this.handleCredential(deployConfig);
      console.log(' ');
      info('启动自动化部署项目');
      console.log(' ');
      this.ssh = new SSH();
      // 执行构建脚本
      await this.buildScript(deployConfig);
      // 连接ssh
      await this.conncetSSH(deployConfig);
      //备份和删除
      await this.backAndRemove(deployConfig);
      // 上传文件
      await this.upload(deployConfig);
      console.log(' ');
      done('自动化部署项目成功');
    } catch(e) {
      failSpinner(e.message || '执行自动化部署失败');
      console.log(' ');
      errorLog('自动化部署项目失败');
      process.exit(-1);
    } finally {
      this.ssh.dispose();
      process.exit(0);
    }
  }

  // 查询对应环境所有tags
  async getTags({ env }) {
    // 检测配置文件是否存在
    const deployConfig = this.getDeployConfig(env);
    try {
      // 密码文件处理
      await this.handleCredential(deployConfig);
      this.ssh = new SSH();
      // 连接ssh
      await this.conncetSSH(deployConfig, false);
      await this.getBackupTags(deployConfig);
    } catch(e) {
      failSpinner(e.message || '查询备份tag失败');
      console.log(' ');
      errorLog('查询备份tag失败');
      process.exit(-1);
    } finally {
      this.ssh.dispose();
      process.exit(0);
    }
    
  }

  async getBackupTags(deployConfig) {
    try {
      logWithSpinner('查询备份tags');
      // ssh连接
      const stdout = await this.ssh.getBackupTags(deployConfig);
      succeedSpinner('查询备份tags成功');

      console.log(' ');
      console.log(stdout);
      console.log(' ');
    } catch(e) {
      throw new Error('查询备份tags失败');
    }
  }

  // 回滚对应环境 tags
  async rollback({ env, tag }) {
    // 检测配置文件是否存在
    const deployConfig = this.getDeployConfig(env);
    try {
      // 密码文件处理
      await this.handleCredential(deployConfig);
      this.ssh = new SSH();
      // 连接ssh
      await this.conncetSSH(deployConfig, false);
      await this.doRollback(deployConfig, tag);
    } catch(e) {
      failSpinner(e.message || '回滚失败');
      console.log(' ');
      errorLog('回滚失败');
      process.exit(-1);
    } finally {
      this.ssh.dispose();
      process.exit(0);
    }
  }

  async doRollback(deployConfig, tag) {
    try {
      logWithSpinner('开始回滚');
      // 回滚操作
      await this.ssh.rollback(deployConfig, tag);
      
      succeedSpinner('回滚成功');
    } catch(e) {
      throw new Error('回滚失败');
    }
  }

  getDeployConfig(env) {
    if (!fs.existsSync(this.configFile)) {
      errorLog('部署文件 deploy.config.json 不存在， 请初始化部署文件');
      return;
    }
    // 读取配置文件内容
    const config = fs.readJSONSync(this.configFile);

    const deployConfig = config[env];

    if (!deployConfig) {
      errorLog(`部署环境 ${env} 不存在，请检查配置文件`);
      return;
    }
    return deployConfig;
  }

  // 校验配置文件是否正确
  async checkEnv() {
    
  }

  // 密码权限校验
  async handleCredential(deployConfig, reCredential = false) {
    const { host, port, username, password } = deployConfig;
    // 本地配置优先
    if (username && password) {
      return;
    }
    const home = os.homedir();
    const file = path.join(home, '.leaf_credential.json');
    const key = `${host}-${port}`;
    let authInfo = null;

    if (!fs.existsSync(file)) {
      authInfo = await this.promptAndResolveCredential({
        file,
        key
      });
    } else {
      const credential = fs.readJSONSync(file);
      if (credential[key] && !reCredential) {
        authInfo = credential[key];
      } else {
        authInfo = await this.promptAndResolveCredential({
          credential,
          file,
          key
        });
      }
    }
    deployConfig.username = authInfo.username;
    deployConfig.password = authInfo.password;
  }

  async promptAndResolveCredential(info) {
    const { credential, file, key } = info;
    const answers = await inquirer.prompt([
      {
        name: 'username',
        type: 'input',
        message: '用户名',
        default: 'root',
      },
      {
        name: 'password',
        type: 'password',
        message: '密码',
        default: 'root',
      },
      {
        name: 'remember',
        type: 'confirm',
        message: `记住密码?`,
        default: '',
        when: (answers) => answers.username && answers.password
      }, 
    ]);
    const { remember, username, password } = answers;
    const authInfo = {
      username,
      password,
    };
    // 不记住密码
    if (!remember) {
      return authInfo;
    }
    // 如果已存在认证文件
    let obj = credential
    if (credential) {
      credential[key] = authInfo;
    } else {
      obj = {
        [key]: authInfo
      }
    }
    fs.writeFileSync(file, JSON.stringify(obj, null, 2));
    return authInfo;
  }

  async buildScript(deployConfig) {
    logWithSpinner('执行构建脚本');
    // 执行构建命令
    try {
      await this.build(deployConfig);
      succeedSpinner('执行构建脚本成功');
    } catch(e) {
      throw new Error('执行构建脚本失败');
    }
  }

  async conncetSSH(deployConfig, log = true) {
    try {
      log && logWithSpinner('ssh连接服务器');
      // ssh连接
      await this.ssh.connect(deployConfig);
      log && succeedSpinner('ssh连接服务器成功');
    } catch(e) {
      if (e.level && e.level.includes('client-authentication')) {
        log && failSpinner('ssh用户名或者密码错误');
        info('请重新输入账号和密码');
        console.log(' ');
        await this.handleCredential(deployConfig);
        await this.conncetSSH(deployConfig, log);
        return;
      }
      throw new Error('ssh连接服务器失败');
    }
  }

  // 备份和异常
  async backAndRemove(deployConfig) {
    const { delpoyDir } = deployConfig;
    try {
      const isExit = await this.ssh.test(delpoyDir);
      // 如果部署项目不存在则不需要备份和删除
      if (!isExit) {
        return;
      }
      const answers = await inquirer.prompt([
        {
          name: 'backup',
          type: 'confirm',
          message: `删除之前需要备份(${deployConfig.delpoyDir})吗?`,
          default: '',
        },
        {
          name: 'backupName',
          type: 'input',
          message: `请输入备份tag`,
          default: '',
          when: (answers) => answers.backup
        },
      ]);
     
      if (answers.backup) {
        logWithSpinner('开始备份项目');
        // 备份远程目录
        await this.ssh.backup(delpoyDir, answers.backupName);
        succeedSpinner('备份项目成功');
      }
      logWithSpinner('开始删除远程项目');
      // 删除远程目录
      await this.ssh.remove(delpoyDir);
      succeedSpinner('删除项目远程项目成功');
    } catch(e) {
      throw new Error('备份或删除远程项目失败');
    }
  }

  // 上传文件
  async upload(deployConfig) {
    // 上传本地构建文件
    try {
      logWithSpinner('上传本地构建部署包');
      const { dist, delpoyDir } = deployConfig;
      await this.ssh.uploadLocalFiles(dist, delpoyDir);
      succeedSpinner('上传本地构建部署包成功');
    } catch(e) {
      throw new Error('上传本地构建部署包失败');
    }
  }

  // 执行构建命令
  build({ script }) {
    return new Promise((resolve, reject) => {
      exec(script, { 
        cwd: this.context,
        stdio: 'ignore'
      }, (error) => {
        if (error) {
          reject('执行构建命令失败');
        }
        resolve();
      })
    })
  }
  
  // 用户交互
  async promptAndResolveConfig () {
    const answers = await inquirer.prompt(this.resolveFinalPrompts());
    this.promptCompleteCbs.forEach((cb) => cb(answers));
    const { envs } = answers;
    const config = {};
    envs.forEach((env) => {
      config[env] = answers[env];
      answers[env] = null;
    })
    return config;
  }

  resolveFinalPrompts() {
    return [
      this.featurePrompt,
      ...this.injectedPrompts,
    ]
  }
}