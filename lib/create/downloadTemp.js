/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-10 10:24:49
 * @LastEditTime: 2019-09-15 22:46:11
 * @LastEditors: your name
 */
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
} = require('../util');

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
            log('create project success!', chalk.green('✔'));
            resolve();
          } else {
            failSpinner(`create project fail! code: ${signal}`);
            reject();
          }
        });
      }
    });
  })
}