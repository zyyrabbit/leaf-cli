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

const { 
  getPromptModules,
  titleClearConsole
} = require('../util');

async function create(name) {
  // 项目目录
  const targetDir = path.resolve(name);
  await titleClearConsole(true);
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
  // await downloadTemp(config.gitUrl, name, targetDir);\
  const creator = new Creator(name, targetDir, getPromptModules());
  await creator.create();
}

module.exports = (...args) => {
  return create(...args).catch(error => {
    console.log(error);
    process.exit(1);
  })
}







  

