#!/usr/bin/env node

const path = require('path');
const rm = require('rimraf').sync;
const { exec } = require('child_process');
const ora = require('ora');
const spinner = ora('loading @leafs/app');
const utils = require('../utils');
const dirPath = path.resolve('.leaf');

spinner.color = 'green';
spinner.text = 'update leaf……';
spinner.start();

// 删除目录
rm(dirPath);

utils.copyDirSync(path.join(__dirname, '../.leaf'), dirPath);

const child = exec('npm install --save @leafs/app@latest');

child.on('exit', function(code) {
  if (code === 0) {
    spinner.text = 'update leaf project success!';
    spinner.succeed();
  } else {
    spinner.text = 'update leaf project fail!';
    spinner.fail();
  }
})




