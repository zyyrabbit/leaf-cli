#!/usr/bin/env node

const Deploy = require('./Deploy.js');
const { getPromptModules } = require('./getPromptModules.js');
const { 
  errorLog
} = require('../util');

async function deploy(action, params) {
  const deploy = new Deploy(process.cwd(), getPromptModules());
  // 初始化配置操作
  if (action === 'init') {
    await deploy.init();
    return;
  }

  // 查询所有备份tag
  if (action === 'tag') {
    await deploy.tags(params);
    return;
  }
  // 回滚操作
  if (action === 'rollback') {
    await deploy.rollback(params);
    return;
  }
  
  await deploy.run(action);
}

module.exports = (...args) => {
  return deploy(...args).catch(error => {
    errorLog(error)
  })
}






