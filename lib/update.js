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





