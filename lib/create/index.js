#!/usr/bin/env node

const path = require('path');
const Creator = require('./Creator');
const config = require('../../config.js');
const downloadTemp = require('./downloadTemp');
const { 
  getPromptModules
} = require('./util');

async function create(name) {
  // 生成的项目目录
  const targetDir = path.resolve(name);

  // await downloadTemp(config.gitUrl, name, targetDir);

  const creator = new Creator(name, targetDir, getPromptModules());
  await creator.create();
  
}

module.exports = (...args) => {
  return create(...args).catch(error => {
    console.log(error);
  })
}







  

