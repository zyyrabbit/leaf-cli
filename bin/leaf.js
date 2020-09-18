#!/usr/bin/env node
/*
 * @Description: In User Settings Edit
 * @Author: zhangyiyong
 * @Date: 2019-08-19 11:11:23
 * @LastEditTime: 2019-09-12 18:02:43
 * @LastEditors: Please set LastEditors
 */

const chalk = require('chalk');
const program = require('commander');
const semver = require('semver');
const requiredVersion = require('../package.json').engines.node;

// 检查版本
function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ));
    process.exit(1);
  }
}

checkNodeVersion(requiredVersion, 'leaf-cli');

if (semver.satisfies(process.version, '9.x')) {
  console.log(chalk.red(
    `You are using Node ${process.version}.\n` +
    `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
    `It's strongly recommended to use an active LTS version instead.`
  ))
}

program
  .version(require('../package').version)
  .usage('<command> [options]')

// 创建项目
program
  .command('create <app-name>')
  .description('create a new leaf project')
  .action((name, cmd) => {
    if (process.argv.slice(3).length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    require('../lib/create')(name)
  })

// 启动项目
program
  .command('start')
  .description('start a leaf project')
  .action(() => {
    require('../lib/start')()
  })
  
// 更新项目
program
  .command('update')
  .description('update a leaf project')
  .action(() => {
    require('../lib/update')()
  })

// 部署项目
program
  .command('deploy <action>')
  .option('-e, --env <env>', 'select the tag env')
  .option('-t, --tag <tag>', 'select the roolback env tag')
  .description('deploy a frontend project')
  .action((action, cmd) => {
    require('../lib/deploy')(action, {
      env: cmd.env,
      tag: cmd.tag
    })
  }).on('--help', function() {
    console.log('  deploy init    generator the config');
    console.log('  deploy env     select env to run');
    console.log('  deploy tag env   query tag');
    console.log('  deploy rollback tag env roolback to the vesion');
  });
 


// 处理未知命令
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

// 添加额外的说明信息
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`leaf <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

