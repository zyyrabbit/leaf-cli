module.exports = cli => {

  cli.injectFeature({
    name: 'Linter / Formatter',
    value: 'linter',
    short: 'Linter',
    description: 'Check and enforce code quality with ESLint or Prettier',
    link: 'https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint',
    plugins: ['eslint'],
    checked: true
  })

  cli.injectPrompt({
    name: 'eslintConfig',
    when: answers => answers.features.includes('linter'),
    type: 'list',
    message: 'Pick a linter / formatter config:',
    description: 'Checking code errors and enforcing an homogeoneous code style is recommended.',
    choices: answers => [
      {
        name: 'ESLint with error prevention only',
        value: 'base',
        short: 'Basic'
      },
      {
        name: 'ESLint + Airbnb config',
        value: 'airbnb',
        short: 'Airbnb'
      },
      {
        name: 'ESLint + Standard config',
        value: 'standard',
        short: 'Standard'
      },
      {
        name: 'ESLint + Prettier',
        value: 'prettier',
        short: 'Prettier'
      },
      ...(
        answers.features.includes('ts')
          ? [{
            name: `TSLint (deprecated)`,
            value: 'tslint',
            short: 'TSLint'
          }]
          : []
      )
    ]
  })

  cli.onPromptComplete((answers, options) => {
    if (answers.features.includes('linter') && answers.eslintConfig !== 'tslint') {
      options.plugins['./plugin/cli-plugin-eslint'] = {
        config: answers.eslintConfig,
        lintOn: answers.lintOn
      }
    }
  })
}
