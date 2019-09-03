#!/usr/bin/env node

const { spawn } = require('child_process');
const ora = require('ora');

async function start() {

  const crossNpm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
  const spinner = ora('starting @leafs/app');
  const child = spawn(crossNpm, ['run', 'serve'], { stdio: 'inherit' });
  
  child.on('exit', function(code, signal) {
    if (code === 0) {
      spinner.text = 'start leaf project success!';
      spinner.succeed();
    } else {
      spinner.text = 'start leaf project fail!';
      spinner.fail();
    }
    spinner.stop();
  });
}

module.exports = (...args) => {
  return start(...args).catch(error => {
    console.log(error)
  })
}






