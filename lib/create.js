#!/usr/bin/env node

const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs');
const rm = require('rimraf').sync;
const { spawn } = require('child_process');
const config = require('../config.js');
const utils = require('../utils');
const spinner = ora('loading @leafs/app');
const crossNpm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

async function create(projectName, options) {

  const projectPath = path.resolve(projectName);

  spinner.color = 'green';
  spinner.text = 'downloading template……';
  spinner.start();

  if (fs.existsSync(projectPath)) {
    await rm(projectPath);
  }

  download(`direct:${config.gitUrl}`, projectName, { clone: true }, async function (err) {
    spinner.stop();

    if (err) {
      spinner.text = `Error: ${err}`;
      spinner.fail();
      // fail rm the project floder
      await rm(projectPath);
    
    } else {

      utils.copyDirSync(path.join(__dirname, '../.leaf'), path.join(projectPath, '.leaf'));

      const child = spawn(crossNpm, ['i'], {
        cwd: projectPath,
        stdio: 'inherit' 
      });

      child.on('exit', function(code) {
        if (code === 0) {
          spinner.text = 'create leaf project success!';
          spinner.succeed();

          const startCmd = 'leaf start';
          console.log(chalk.white('please run '), 
          chalk.bgBlue(`cd ${projectName} && ${startCmd}`), 
          chalk.white('to start it'));

        } else {
          spinner.text = 'create leaf project fail!';
          spinner.fail();
        }
        
      });
    }
  });
}

module.exports = (...args) => {
  return create(...args).catch(error => {
    console.log(error)
  })
}







  

