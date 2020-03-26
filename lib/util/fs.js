const fs = require('fs-extra');
const path = require('path');

function deleteRemovedFiles (directory, newFiles, previousFiles) {
 
  const filesToDelete = Object.keys(previousFiles)
    .filter(filename => !newFiles[filename]);

  return Promise.all(filesToDelete.map(filename => {
    return fs.unlink(path.join(directory, filename));
  }))
}

exports.writeFileTree = async function(dir, files, previousFiles) {
  if (previousFiles) {
    await deleteRemovedFiles(dir, files, previousFiles);
  }
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    // 获取文件目录
    const dirPath = path.dirname(filePath);
  
    // 如果目录不存在生成目录
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, files[name]);
  })
}

exports.copyDirSync = function copyDir(src, dest) {
 
  if (!fs.existsSync(src)) return -1;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
 
  let files = [],
      currSrcPath,
      currDestPath;
  files = fs.readdirSync(src);
  
  files.forEach(function(path) {
    currSrcPath = path.join(src, path);
    currDestPath = path.join(dest, path);
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
