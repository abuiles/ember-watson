var chalk     = require('chalk');
var fs        = require('fs');

var findFiles = require('./helpers/find-files');

var qunitTransforms = require('./formulas/qunit-transforms');
var prototypeExtensionTransforms = require('./formulas/prototype-extension-transforms');
var transformEmberDataModelLookups = require('./formulas/ember-data-model-lookup-transform');
var transformEmberDataAsyncFalseRelationships = require('./formulas/ember-data-async-false-relationships-transforms');
var transformResourceRouterMapping = require('./formulas/resource-router-mapping');
var transformMethodify = require('./formulas/methodify');
var FindOverloadedCPs = require('./formulas/find-overloaded-cps');

module.exports = EmberWatson;

function EmberWatson() { }

EmberWatson.prototype._transformEmberDataAsyncFalseRelationships = transformEmberDataAsyncFalseRelationships;

EmberWatson.prototype.transformEmberDataAsyncFalseRelationships = function(rootPath) {
  var files = findFiles(rootPath, '.js');

  transform(files, this._transformEmberDataAsyncFalseRelationships);
};

EmberWatson.prototype._transformEmberDataModelLookups = transformEmberDataModelLookups;

EmberWatson.prototype.transformEmberDataModelLookups = function(rootPath) {
  var files = findFiles(rootPath, '.js');

  transform(files, this._transformEmberDataModelLookups);
};

EmberWatson.prototype._transformQUnitTest = qunitTransforms;

EmberWatson.prototype.transformQUnitTest = function(rootPath) {
  var tests  = findFiles(rootPath, '.js').filter(function(file){
    return file.indexOf('-test.js') > 0;
  });

  transform(tests, this._transformQUnitTest);
};

EmberWatson.prototype._transformPrototypeExtensions = prototypeExtensionTransforms;

EmberWatson.prototype.transformPrototypeExtensions = function(rootPath) {
  var files = findFiles(rootPath, '.js');

  transform(files, this._transformPrototypeExtensions);
};

EmberWatson.prototype._transformMethodify = transformMethodify;
EmberWatson.prototype.transformMethodify = function(rootPath) {
  var files = findFiles(rootPath, '.js');

  transform(files, this._transformMethodify);
};

EmberWatson.prototype._transformResourceRouterMapping = transformResourceRouterMapping;

EmberWatson.prototype.transformResourceRouterMapping = function(routerPath) {
  transform([routerPath], this._transformResourceRouterMapping);
};

EmberWatson.prototype.findOverloadedCPs = function(rootPath) {
  var searcher = new FindOverloadedCPs();
  transform(findFiles(rootPath, '.js'), function(source, filename) {
    searcher.examineSource(source, filename);
    return source;
  });
  return searcher;
};

function transform(files, transformFormula) {
  var wontFix = [];

  files.forEach(function(file) {
    var source = fs.readFileSync(file);
    try {
      var newSource = transformFormula(source, file);
      if (source != newSource) {
        console.log(chalk.green('Fixed: ', file));

        fs.writeFileSync(file, newSource);
      } else {
        console.log(chalk.blue('Looks Good', file));
      }
    } catch (error) {
      wontFix.push({
        name: file,
        error: error.message
      });
    }
  }, this);

  if (wontFix.length > 0) {
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
