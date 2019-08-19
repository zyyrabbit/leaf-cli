#!/usr/bin/env node

const { spawn } = require('child_process');
const crossNpm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
const child = spawn(crossNpm, ['run', 'serve'], { stdio: 'inherit' });
const ora = require('ora');
const spinner = ora('loading @leafs/app');

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





