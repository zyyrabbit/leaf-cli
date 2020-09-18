exports.getPromptModules = () => {
  return [
    'dev',
    'test',
    'prod'
  ].map(file => require(`./promptModules/${file}`))
}