const PromptModuleAPI = require('./PromptModuleAPI');
const inquirer = require('inquirer');
const Generator = require('./Generator');
const { 
  writeFileTree,
  clearConsole,
  loadModule
} = require('./util');

module.exports = class Creator {
  constructor(name, context, promptModules) {
    // 项目名称
    this.name = name;
    // 项目目录
    this.context = context;
    // 项目插件目录
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
      await clearConsole(true);
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