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
// 跨平台处理npm
exports.crossNpm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
