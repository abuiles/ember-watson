var chalk      = require('chalk');
var fs         = require('fs');
var existsSync = require('exists-sync');
var EOL        = require('os').EOL;

var findFiles = require('./helpers/find-files');

var qunitTransforms = require('./formulas/qunit-transforms');
var prototypeExtensionTransforms = require('./formulas/prototype-extension-transforms');
var transformEmberDataModelLookups = require('./formulas/ember-data-model-lookup-transform');
var transformEmberDataAsyncFalseRelationships = require('./formulas/ember-data-async-false-relationships-transforms');
var transformResourceRouterMapping = require('./formulas/resource-router-mapping');
var transformMethodify = require('./formulas/methodify');
var FindOverloadedCPs = require('./formulas/find-overloaded-cps');
var transformDestroyApp = require('./formulas/destroy-app-transform');
var removeEmberK = require('./formulas/remove-ember-k');
var replaceNeedsWithInjection = require('./formulas/replace-needs-with-injection');
var removeEmberDataIsNewSerializerAPI = require('./formulas/remove-ember-data-is-new-serializer-api');

module.exports = EmberWatson;

function EmberWatson() { }

EmberWatson.prototype._removeEmberDataIsNewSerializerAPI = removeEmberDataIsNewSerializerAPI;
EmberWatson.prototype.removeEmberDataIsNewSerializerAPI = function(path, dryRun) {
  var files = findFiles(path, '.js');
  transform(files, this._removeEmberDataIsNewSerializerAPI, dryRun);
};

EmberWatson.prototype._transformEmberDataAsyncFalseRelationships = transformEmberDataAsyncFalseRelationships;

EmberWatson.prototype.transformEmberDataAsyncFalseRelationships = function(rootPath, dryRun) {
  var files = findFiles(rootPath, '.js');

  transform(files, this._transformEmberDataAsyncFalseRelationships, dryRun);
};

EmberWatson.prototype._transformEmberDataModelLookups = transformEmberDataModelLookups;

EmberWatson.prototype.transformEmberDataModelLookups = function(rootPath, dryRun) {
  var files = findFiles(rootPath, '.js');

  transform(files, this._transformEmberDataModelLookups, dryRun);
};

EmberWatson.prototype._transformQUnitTest = qunitTransforms;

EmberWatson.prototype.transformQUnitTest = function(rootPath, dryRun) {
  var tests  = findFiles(rootPath, '.js').filter(function(file){
    return file.indexOf('-test.js') > 0;
  });

  transform(tests, this._transformQUnitTest, dryRun);
};

EmberWatson.prototype._transformPrototypeExtensions = prototypeExtensionTransforms;

EmberWatson.prototype.transformPrototypeExtensions = function(rootPath, dryRun) {
  var files = findFiles(rootPath, '.js');

  transform(files, this._transformPrototypeExtensions, dryRun);
};

EmberWatson.prototype._transformMethodify = transformMethodify;
EmberWatson.prototype.transformMethodify = function(rootPath, dryRun) {
  var files = findFiles(rootPath, '.js');

  transform(files, this._transformMethodify, dryRun);
};

EmberWatson.prototype._transformResourceRouterMapping = transformResourceRouterMapping;

EmberWatson.prototype.transformResourceRouterMapping = function(routerPath, dryRun) {
  transform([routerPath], this._transformResourceRouterMapping, dryRun);
};

EmberWatson.prototype._transformDestroyApp = transformDestroyApp;

EmberWatson.prototype.removeEmberK = removeEmberK;

EmberWatson.prototype.replaceNeedsWithInjection = function(path, dryRun) {
  var files = findFiles(path, '.js');
  transform(files, this._replaceNeedsWithInjection, dryRun);
};

EmberWatson.prototype._replaceNeedsWithInjection = replaceNeedsWithInjection;

EmberWatson.prototype.transformTestToUseDestroyApp = function(rootPath, dryRun) {
  if (!existsSync('tests/helpers/destroy-app.js') && !dryRun) {
    console.log(
      chalk.red('tests/helpers/destroy-app.js file is not present. ' +
        'You must either manually place the file or upgrade to an ' +
        'ember-cli version > 1.13.8.' + EOL +
        'For more info, visit ' +
        'https://gist.github.com/blimmer/35d3efbb64563029505a#create-your-own-destroy-app-helper'
      )
    );
    return;
  }

  var tests  = findFiles(rootPath, '.js').filter(function(file){
    return file.indexOf('-test.js') > 0;
  });

  transform(tests, this._transformDestroyApp, dryRun);
};

EmberWatson.prototype.findOverloadedCPs = function(rootPath, dryRun) {
  var searcher = new FindOverloadedCPs();
  transform(findFiles(rootPath, '.js'), function(source, filename) {
    searcher.examineSource(source, filename);
    return source;
  }, dryRun);
  return searcher;
}
;
function transform(files, transformFormula, dryRun) {
  var wontFix = [];

  files.forEach(function(file) {
    var source = fs.readFileSync(file);
    try {
      var newSource = transformFormula(source, file);
      if (source != newSource) {
        if (dryRun) {
          console.log({ filename: file }, '\0');
        } else {
          console.log(chalk.green('Fixed: ', file));

          fs.writeFileSync(file, newSource);
        }
      }
    } catch (error) {
      wontFix.push({
        name: file,
        error: error.message
      });
    }
  }, this);

  if (wontFix.length > 0 && !dryRun) {
    console.log(
      chalk.red('\n\nOh Dear! I wasn\'t able to save the following files:')
    );

    wontFix.forEach(function(file) {
      console.log(chalk.red(file.name + ' - ' + file.error));
    });

    console.log(chalk.red('\nA possible cause is having all the source code commented.'));
    console.log(chalk.red('If that\'s not the problem please fill a report with the hospital directors\nat https://github.com/abuiles/ember-watson/issues.\n\n'));
  }

  return true;
}
