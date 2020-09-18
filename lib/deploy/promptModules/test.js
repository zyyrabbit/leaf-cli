const { generatorEnvConfig, configKeys } = require('./config.js');
const env = 'test';
const testConfig = generatorEnvConfig('test');

module.exports = cli => {
  // envs choice
  cli.injectFeature({
    name: '测试环境',
    value: env,
    short: env,
    checked: false,
    description: '生成测试环境参数',
  })

  cli.injectPrompt(testConfig);

  cli.onPromptComplete((answers) => {
    const { envs } = answers;
    if (!envs.includes(env)) {
      return;
    }
    const config = answers[env] = {};
    configKeys().forEach((key) => {
      config[key] = answers[`${env}-${key}`];
    })
  })

}
