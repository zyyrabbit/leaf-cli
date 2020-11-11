#!/usr/bin/env node
/*
 * @Author: zyyrabbit
 * @Date: 2019-08-19 11:11:23
 * @LastEditTime: 2019-09-15 22:08:14
 * @LastEditors: your name
 * @Description: 
 * @输出一段不带属性的自定义信息
 */

const { exec } = require('child_process');
const chalk = require('chalk');
const { 
  logWithSpinner, 
  stopSpinner, 
  failSpinner, 
  errorLog,
  crossNpm,
  log
} = require('./util');

async function update() {

  logWithSpinner('update @leafs/app...');
  const child = exec(`${crossNpm} install --save @leafs/app@latest`);

  child.on('exit', function(code, signal) {
    if (code === 0) {
      stopSpinner(false);
      log('update @leafs/app success!', chalk.green('✔'));
    } else {
      failSpinner(`update @leafs/app fail! code: ${signal}`);
    }
  })

}

module.exports = (...args) => {
  return update(...args).catch(error => {
    errorLog(error)
  })
}





