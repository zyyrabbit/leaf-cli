[
  'createTools',
  'logger',
  'spinner',
  'fs',
  'module',
  'mergeDeps',
  'configTransforms',
  'generateTitle'
].forEach(m => {
  Object.assign(exports, require(`./${m}`))
})

exports.crossNpm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
