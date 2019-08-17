#!/usr/bin/env node

const commander = require('commander');

commander
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('create', 'create leaf project')
  .command('start', 'start leaf project')
  .command('update', 'update leaf project')

commander.parse(process.argv);
