const { generatorEnvConfig, configKeys } = require('./config.js');
const env = 'prod';
const prodConfig = generatorEnvConfig('prod',  {
  name: {
    default: env,
  }
});

module.exports = cli => {
  // envs choice
  cli.injectFeature({
    name: '生产环境',
    value: env,
    short: env,
    checked: false,
    description: '生成生产环境参数',
  })

  cli.injectPrompt(prodConfig);

  cli.onPromptComplete((answers) => {
    const { envs } = answers;
    if (!envs.includes(env)) {
      return;
    }
    const config = answers[env] = {};
    configKeys().forEach((key) => {
      config[key] = answers[`${env}-${key}`];
    });
  })
}
