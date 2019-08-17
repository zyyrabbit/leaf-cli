#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const rm = require('rimraf').sync;
const execSync = require('child_process').execSync;
const utils = require('../utils');
const dirPath = path.join(process.cwd(), '.leaf');

// 删除目录
rm(dirPath);

utils.copyDirSync('../.leaf', path.join(process.cwd(), '.leaf'));

execSync('npm install --save @leafs/app@latest');

console.log(chalk.white('更新leaf 配置成功！'))



