#!/usr/bin/env node
/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-19 11:11:23
 * @LastEditTime: 2019-09-12 18:02:43
 * @LastEditors: Please set LastEditors
 */

const chalk = require('chalk');
const program = require('commander');
const semver = require('semver');
const requiredVersion = require('../package.json').engines.node;

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

program
  .command('create <app-name>')
  .description('create a new leaf project')
  .action((name, cmd) => {
    if (process.argv.slice(3).length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    require('../lib/create')(name)
  })

program
  .command('start')
  .description('start a leaf project')
  .action(() => {
    require('../lib/start')()
  })

program
  .command('update')
  .description('update a leaf project')
  .action(() => {
    require('../lib/update')()
  })

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

function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}


