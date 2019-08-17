#!/usr/bin/env node

const path = require('path');
const rm = require('rimraf').sync;
const exec = require('child_process').exec;
const ora = require('ora');
const spinner = ora('loading @leafs/app');
const utils = require('../utils');
const dirPath = path.join(process.cwd(), '.leaf');

spinner.color = 'green';
spinner.text = 'update leaf……';
spinner.start();

// 删除目录
rm(dirPath);

utils.copyDirSync('../.leaf', dirPath);

const child = exec('npm install --save @leafs/app@latest');

child.on('close', function(code) {
  if (code === 0) {
    spinner.text = 'update leaf project success!';
    spinner.succeed();
  } else {
    spinner.text = 'update leaf project fail!';
    spinner.fail();
  }
})




