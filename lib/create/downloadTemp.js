const download = require('download-git-repo');
const fs = require('fs');
const rm = require('rimraf').sync;
const chalk = require('chalk');
const { spawn } = require('child_process');
const { 
  logWithSpinner, 
  stopSpinner, 
  failSpinner, 
  crossNpm,
  log,
} = require('./util');

module.exports = async function(gitUrl, name, targetDir) {

  logWithSpinner('downloading template...');

  if (fs.existsSync(targetDir)) {
    await rm(targetDir);
  }

  await new Promise((resolve, reject) => {
    download(`direct:${gitUrl}`, name, { clone: true }, async function (err) {
      if (err) {
        failSpinner(`Error: ${err}`);
        await rm(targetDir);
        reject();
      } else {
        stopSpinner(false);
        log('downloading template success!', chalk.green('✔'));
        const child = spawn(crossNpm, ['i'], {
          cwd: targetDir,
          stdio: 'inherit' 
        });
  
        child.on('exit', function(code, signal) {
          if (code === 0) {
            log('create leaf project success!', chalk.green('✔'));
            const startCmd = 'leaf start';
            console.log(chalk.white('please run '), 
            chalk.bgBlue(`cd ${name} && ${startCmd}`), 
            chalk.white('to start it'));
            resolve();
          } else {
            failSpinner(`create leaf project fail! code: ${signal}`);
            reject();
          }
        });
      }
    });
  })
}