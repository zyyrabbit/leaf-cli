#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');

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

