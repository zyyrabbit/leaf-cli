#!/usr/bin/env node
const { exec } = require('child_process');
const chalk = require('chalk');
const { 
  logWithSpinner, 
  stopSpinner, 
  failSpinner, 
  log
} = require('./util');

async function update() {

  logWithSpinner('update leaf...');
  const child = exec('npm install --save @leafs/app@latest');

  child.on('exit', function(code) {
    if (code === 0) {
      stopSpinner(false);
      log('update leaf project success!', chalk.green('✔'));
    } else {
      failSpinner(`update leaf project fail! code: ${signal}`);
    }
  })

}

module.exports = (...args) => {
  return update(...args).catch(error => {
    log.error(error)
  })
}





