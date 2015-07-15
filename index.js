'use strict';

var program = require('commander');
var pkg = require('./package.json');
var chalk = require('chalk');
var logger = require('./lib/logger');
var didYouMean = require('didyoumean');

program.version(pkg.version);
program.option('-t, --token <token>', 'supply an auth token for this command');
program.option('-s, --silent', 'non-interactive mode: error instead of waiting for prompts');

var client = {};
client.cli = program;
client.logger = require('./lib/logger');
client.errorOut = function(error, status) {
  require('./lib/errorOut')(client, error, status);
};

require('./commands')(client);

var commandNames = program.commands.map(function(cmd) {
  return cmd._name;
});

program.action(function(cmd) {
  logger.error(
    chalk.bold.red('Error:'),
    chalk.bold(cmd), 'is not a Firebase command'
  );

  var suggestion = didYouMean(cmd, commandNames);
  if (suggestion) {
    logger.error();
    logger.error('Did you mean', chalk.bold(suggestion) + '?');
  }

  process.exit(1);
});

module.exports = client;
