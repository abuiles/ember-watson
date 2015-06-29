'use strict';

var program = require('commander');
var Watson = require('./watson');
var watson = new Watson();
var version = require('../package.json').version;

program
  .version(version);

program
  .command('upgrade-qunit-tests [testsPath]')
  .description('Fix QUnit tests to match 2.0 syntax. testsPath defaults to tests/')
  .action(function(testsPath){
    testsPath = testsPath || 'tests';
    watson.transformQUnitTest(testsPath);
  });

program
  .command('convert-prototype-extensions [appPath]')
  .description('Convert computed properties and observers to not use prototype extensions. appPath defaults to app/')
  .action(function(appPath){
    appPath = appPath || 'app';
    watson.transformPrototypeExtensions(appPath);
  });

program
  .command('convert-ember-data-model-lookups [appPath]')
  .description('convert Ember Data model lookups to use a dasherized string')
  .action(function(appPath) {
    appPath = appPath || 'app';
    watson.transformEmberDataModelLookups(appPath);
  });

program
  .command('convert-ember-data-async-false-relationships [appPath]')
  .description('convert Ember Data relationship with implicit async: false to explicit option')
  .action(function(appPath) {
    appPath = appPath || 'app';
    watson.transformEmberDataAsyncFalseRelationships(appPath);
  });

module.exports = function init(args) {
  program.parse(args);
};
