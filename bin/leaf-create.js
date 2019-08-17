#!/usr/bin/env node
const program = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const rm = require('rimraf').sync;
const { spawn } = require('child_process');
const config = require('../config.js');
const utils = require('../utils');
const spinner = ora('loading @leafs/app');
const crossNpm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

program.parse(process.argv)

program
  .usage('[project-name]')

if (program.args.length < 1) return program.help();

const projectName = program.args[0];
const projectPath = path.join(process.cwd(), projectName);

spinner.color = 'green';
spinner.text = 'downloading template……';
spinner.start();

download(`direct:${config.gitUrl}`, projectName, { clone: true }, function (err) {

  if (err) {
    spinner.text = `Error: ${err}`;
    spinner.fail();
    // fail rm the project floder
    rm(projectPath);
   
  } else {

    utils.copyDirSync('./.leaf', path.join(projectPath, '.leaf'));

    const child = spawn(crossNpm, ['i'], {
      cwd: projectPath
    });

    child.on('close', function(code) {
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
      spinner.stop();
    });
  }
});




  

