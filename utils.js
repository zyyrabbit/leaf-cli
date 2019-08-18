const fs = require('fs')

exports.copyDirSync = function copyDir(src, dest) {
 
  if (!fs.existsSync(src)) return -1;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);
 
  let files = [],
      currSrcPath,
      currDestPath;
  files = fs.readdirSync(src);
  
  files.forEach(function(path) {
    currSrcPath = src + '/' + path;
    currDestPath = dest + '/' + path;
    if (fs.statSync(currSrcPath).isDirectory()) {
      copyDir(currSrcPath, currDestPath)
    } else {
      let data = fs.readFileSync(currSrcPath, {
        encoding: 'utf-8'
      });
      fs.writeFileSync(currDestPath, data)
    }
  })
}