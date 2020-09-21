const { generatorEnvConfig, configKeys } = require('./config.js');
const env = 'dev';
const devConfig = generatorEnvConfig(env, {
  name: {
    default: env,
  }
});

module.exports = cli => {
  // envs choice
  cli.injectFeature({
    name: '开发环境',
    value: env,
    short: env,
    checked: true,
    description: '生成开发环境参数',
  })

  cli.injectPrompt(devConfig);

  cli.onPromptComplete((answers) => {
    const { envs } = answers;
    if (!envs.includes(env)) {
      return;
    }
    const config = answers[env] = {}
    configKeys().forEach((key) => {
      config[key] = answers[`${env}-${key}`];
    })
  })
}
