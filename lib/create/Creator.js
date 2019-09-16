/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-09 10:31:32
 * @LastEditTime: 2019-09-15 21:58:36
 * @LastEditors: your name
 */

const PromptModuleAPI = require('./PromptModuleAPI');
const inquirer = require('inquirer');
const { spawn } = require('child_process');
const chalk = require('chalk');
const Generator = require('./Generator');

const { 
  writeFileTree,
  clearConsole,
  loadModule,
  crossNpm,
  log,
  error
} = require('../util');
const { defaultPreset } = require('./options');

module.exports = class Creator {
  constructor(name, context, promptModules) {
    // 项目名称
    this.name = name;
    // 项目目录
    this.context = context;
    // 项目插件选择框
    this.featurePrompt = {
      name: 'features',
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [],
      pageSize: 10
    };
    // 注入的选项
    this.injectedPrompts = [];
    this.promptCompleteCbs = [];

    const promptAPI = new PromptModuleAPI(this);
    promptModules.forEach(m => m(promptAPI));
  }
  
  async create() {
    const { name, context } = this;
    let preset = await this.promptAndResolvePreset();

    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      devDependencies: {}
    }
    preset.plugins = {
      ...defaultPreset.plugins,
      ...preset.plugins
    };
    // 写入文件
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2)
    })

    const plugins = await this.resolvePlugins(preset.plugins);
   
    const generator = new Generator(context, {
      pkg,
      plugins,
    });

    await generator.generate({
      extractConfigFiles: true
    });

    await this.npmInstall(name, this.context);

  }
  
  npmInstall(name, targetDir) {
    return new Promise((resolve, reject) => {
      const child = spawn(crossNpm, ['i'], {
        cwd: targetDir,
        stdio: 'inherit' 
      });
  
      child.on('exit', function(code, signal) {
        if (code === 0) {
          log('create leaf project success!', chalk.green('✔'));
          const startCmd = 'leaf start';
          console.log('please run'); 
          console.log(chalk.white(`cd ${name} && ${startCmd}`));
          console.log('to start it');
          resolve();
        } else {
          error(`create leaf project fail! code: ${signal}`);
          reject(signal);
        }
      });
    })
  }

   // { id: options } => [{ id, apply, options }]
  async resolvePlugins (rawPlugins) {
    const plugins = [];
    const context = __dirname;
    for (const id of Object.keys(rawPlugins)) {
      const apply = loadModule(`${id}/generator`, context) || (() => {});
      let options = rawPlugins[id] || {};
      if (options.prompts) {
        const prompts = loadModule(`${id}/prompts`, context);
        if (prompts) {
          log()
          log(`${chalk.cyan(options._isPreset ? `Preset options:` : id)}`);
          options = await inquirer.prompt(prompts);
        }
      };
      plugins.push({ id, apply, options });
    }
    return plugins;
  }

  async promptAndResolvePreset (answers = null) {
    // 用户交互
    if (!answers) {
      await clearConsole();
      answers = await inquirer.prompt(this.resolveFinalPrompts());
    }

    let preset = {
      useConfigFiles: true,
      plugins: {}
    };

    this.promptCompleteCbs.forEach(cb => cb(answers, preset))

    return preset;

  }

  resolveFinalPrompts() {
    return [
      this.featurePrompt,
      ...this.injectedPrompts,
    ]
  }

}