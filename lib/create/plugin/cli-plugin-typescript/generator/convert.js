module.exports = (api, { tsLint = false, convertJsToTs = true } = {}) => {
  const jsRE = /\.js$/;
  const excludeRE = /^tests\/e2e\/|(\.config|rc)\.js$/;
 
  api.postProcessFiles(files => {
    if (convertJsToTs) {
      // delete all js files that have a ts file of the same name
      // and simply rename other js files to ts
      for (const file in files) {
        if (jsRE.test(file) && !excludeRE.test(file)) {
          const tsFile = file.replace(jsRE, '.ts')
          if (!files[tsFile]) {
            let content = files[file];
            files[tsFile] = content;
          }
          delete files[file];
        }
      }
    }
  })
}
