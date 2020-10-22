#!/usr/bin/env node

/*
 * @Description: In User Settings Edit
 * @Author: zyyrabbit
 * @Date: 2019-08-19 11:11:23
 * @LastEditTime: 2019-09-15 22:50:14
 * @LastEditors: your name
 */
const path = require('path');
const fs = require('fs-extra');
const Creator = require('./Creator');
const chalk = require('chalk');
const inquirer = require('inquirer');
const downloadTemp = require('./downloadTemp');
const { 
  getPromptModules,
  titleClearConsole
} = require('../util');

/**
 * 处理目录是否存在
 * @param {*} targetDir 
 */
async function handleExistFile(targetDir) {
  // 判断目录是否存在
   if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `Target directory ${chalk.cyan(targetDir)} already exists.`,
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Cancel', value: false }
        ]
      }
    ]);

    if (!action) {
      return;
    } else if (action === 'overwrite') {
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    }
  }
  return true;
}

async function doCreate(targetDir, name) {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: `please choice project type`,
      choices: [
        { name: 'admin', value: 'admin' },
        { name: 'admin-vue3-beta', value: 'vue3' },
        { name: 'electron', value: 'electron' }
      ]
    }
  ]);
  // 如果为electron-demo 直接拉取项目模板
  if (action === 'electron') {
    await downloadTemp('https://github.com/zyyrabbit/electron-demo.git', name, targetDir);
    return;
  }
  // github 新建仓库只有main 分支了，后面需要指定#barnch
  if (action === 'vue3') {
    await downloadTemp('https://github.com/zyyrabbit/vue3-webpack5-typescript-template.git#main', name, targetDir);
    return;
  }

  const creator = new Creator(name, targetDir, getPromptModules());
  await creator.create();
}

async function create(name) {
  // 项目目录
  const targetDir = path.resolve(name);
  // 检查版本以及清除日志
  await titleClearConsole(true);
  // 检查文件目录是否存在
  if (!await handleExistFile(targetDir)) return;

  doCreate(targetDir, name);
}

module.exports = (...args) => {
  return create(...args).catch(error => {
    console.error(error);
    process.exit(1);
  })
}







  

