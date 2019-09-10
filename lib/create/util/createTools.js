exports.getPromptModules = () => {
  return [
    'typescript',
  ].map(file => require(`../promptModules/${file}`))
}
