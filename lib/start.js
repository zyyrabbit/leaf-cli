#!/usr/bin/env node

const { spawn } = require('child_process');
const chalk = require('chalk');
const { 
  failSpinner,
  log,
  crossNpm
} = require('./util');

async function start() {
  const child = spawn(crossNpm, ['run', 'serve'], { stdio: 'inherit' });
  
  child.on('exit', function(code, signal) {
    if (code === 0) {
      log('start leaf project success!', chalk.green('✔'));
    } else {
      failSpinner(`start leaf project fail! code: ${signal}`);
    }
  });
}

module.exports = (...args) => {
  return start(...args).catch(error => {
    log.error(error)
  })
}






