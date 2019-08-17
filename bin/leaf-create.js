#!/usr/bin/env node
const program = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const rm = require('rimraf').sync;
const config = require('../config.js');
const utils = require('../utils');
const spinner = ora('loading @leafs/app');

program.parse(process.argv)

program
  .usage('[project-name]')

if (program.args.length < 1) return program.help();

const projectName = program.args[0];

spinner.color = 'green';
spinner.text = 'downloading template……';
spinner.start();

download(`direct:${config.gitUrl}`, projectName, { clone: true }, function (err) {

  if (err) {
    spinner.text = `Error: ${err}`;
    spinner.fail();
    // fail rm the project floder
    rm(path.join(process.cwd(), projectName));
   
  } else {

    utils.copyDirSync('./.leaf', path.join(process.cwd(), projectName, '.leaf'));

    spinner.text = 'download success!';
    spinner.succeed();
    
    const startCmd = 'npm run serve';
    console.log(chalk.white('please run '), 
    chalk.bgBlue(`cd ${projectName} && npm i && ${startCmd}`), 
    chalk.white('to start it'));

    spinner.stop();
  }
});




  

