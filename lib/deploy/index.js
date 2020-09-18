#!/usr/bin/env node

const Deploy = require('./Deploy.js');
const { getPromptModules } = require('./getPromptModules.js');
const { 
  errorLog
} = require('../util');

async function deploy(action, params) {
  const deploy = new Deploy(process.cwd(), getPromptModules());
  
  if (action === 'init') {
    await deploy.init();
    return;
  }
  // 查询所有备份tag
  if (action === 'tag') {
    await deploy.getTags(params);
    return;
  }

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






