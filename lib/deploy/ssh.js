const { NodeSSH } = require('node-ssh');
const path = require('path');
const { 
  errorLog,
  info
} = require('../util');

module.exports = class {

  constructor() {
    this.ssh = new NodeSSH();
  }

  // ssh连接
  connect({ host, username, password }) {
    return this.ssh.connect({
      host,
      username,
      password 
    });
  }

  // 断开本地连接
  dispose() {
    this.ssh.dispose();
  }

  formatCommd(str) {
    return str.replace(/\\+/g, '/');
  }

  // 测试远程部署目录的备份
  async test(dir, mode = '-d') {
    dir = this.formatCommd(dir);
    let { code, stdout } = await this.runCommand(`test ${mode} ${dir}; echo $?`);
    return (code === 0 || stdout === '0') ? true : false;
  }

  // 测试远程部署目录的备份
  async getBackupTags({ delpoyDir }) {
    const { dir } = path.parse(delpoyDir);
    let remoteBackupHistory = path.join(dir, '.leaf-depoly.backup', '.history');
    remoteBackupHistory = this.formatCommd(remoteBackupHistory);
    const { stdout } = await this.runCommand(`cat ${remoteBackupHistory}`);
    return stdout;
  }

  async rollback({ delpoyDir }, tag) {
    const { dir, name } = path.parse(delpoyDir);
    let remoteBackup = path.join(dir, '.leaf-depoly.backup');
    remoteBackup = this.formatCommd(remoteBackup);
    // 执行解压缩
    await this.runCommand(`
        rm -rf ${delpoyDir};
        tar -xzvf ${tag}.backup.gz -C ..`, {
      cwd: remoteBackup
    });
  }

  // 远程部署目录的备份
  async backup(backupDir, tag) {
    if (!backupDir) {
      errorLog(`远程部署目录备份输入为空backupDir：${backupDir}`);
      throw Error('远程部署目录备份输入为空');
    }
    const { dir, name } = path.parse(backupDir);
    const currentTime = new Date().getTime();
    const backFileName = tag ? `${tag}.backup.gz` : `${name}-${currentTime}.backup.gz`;
    const remoteBackupDir = path.join(dir, '.leaf-depoly.backup');
    // 判断备份目录是否存在
    const isExit = await this.test(remoteBackupDir);
    if (!isExit) {
      await this.ssh.mkdir(remoteBackupDir);
    }
    // tag 需要去重
    await this.runCommand(`
          tar -cvzf ${backFileName} ${name};
          mv -f ${backFileName} .leaf-depoly.backup;
          ! grep ${backFileName} .leaf-depoly.backup && echo ${backFileName} >>.leaf-depoly.backup/.history`, {
      cwd: dir
    });
  }

  // 删除远程目录
  async remove(path) {
    if (!path) {
      errorLog(`删除文件路径输入为空path：${path}`);
      throw Error('删除文件路径输入为空');
    }
    await this.runCommand(`rm -rf ${path}`);
  }

  // 上传本地构建文件
  uploadLocalFiles(localSource, remoteTarget) {
    if (!localSource && !remoteTarget) {
      errorLog(`上传本地构建文件输入参数为空localSource：${localSource}, remoteTarget：${remoteTarget}`);
      throw Error('上传本地构建文件输入参数为空');
    }
    return this.ssh.putDirectory(localSource, remoteTarget, {
      recursive: true,
      concurrency: 10,
    });
  }

  async runCommand(cmd, options) {
    const rsp = await this.ssh.execCommand(cmd, options);
    if (rsp.code && rsp.code !== 0) {
      throw Error(options.errorMsg);
    }
    return rsp;
  }
}