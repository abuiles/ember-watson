var chalk    = require('chalk');
var fs       = require('fs');
var path     = require('path');

var qunitTransforms = require('./formulas/qunit-transforms');
var prototypeExtensionTransforms = require('./formulas/prototype-extension-transforms');
var transformEmberDataModelLookups = require('./formulas/ember-data-model-lookup-transform');
var walkSync        = require('walk-sync');

module.exports = EmberWatson;

function EmberWatson() { }

EmberWatson.prototype._transformEmberDataModelLookups = transformEmberDataModelLookups;

EmberWatson.prototype._transformQUnitTest = qunitTransforms;

EmberWatson.prototype.transformQUnitTest = function(rootPath) {
  var paths  = walkSync(rootPath);
  var tests  = [];

  paths.forEach(function(file) {
    if (path.extname(file) === '.js' && file.indexOf('-test.js') > 0) {
      tests.push(path.join(rootPath,file));
    }
  });

  transform(tests, qunitTransforms);
};

EmberWatson.prototype._transformPrototypeExtensions = prototypeExtensionTransforms;


EmberWatson.prototype.transformPrototypeExtensions = function(rootPath) {
  var paths  = walkSync(rootPath);
  var files  = [];

  paths.forEach(function(file) {
    if (path.extname(file) === '.js') {
      files.push(path.join(rootPath,file));
    }
  });

  transform(files, this._transformPrototypeExtensions);
};

function transform(files, transformFormula) {
  var wontFix = [];

  files.forEach(function(file) {
    var source = fs.readFileSync(file);
    try {
      var newSource = transformFormula(source);
      if (source != newSource) {
        console.log(chalk.green('Fixed: ', file));

        fs.writeFileSync(file, newSource);
      }
    } catch (err) {
      wontFix.push(file);
    }
  }, this);

  if (wontFix.length > 0) {
    console.log(
      chalk.red('\n\nOh Dear! I wasn\'t able to save the following files:')
    );

    wontFix.forEach(function(file) {
      console.log(chalk.red(file));
    });

    console.log(chalk.red('\nA possible cause is having all the source code commented.'));
    console.log(chalk.red('If that\'s not the problem please fill a report with the hospital directors\nat https://github.com/abuiles/ember-watson/issues.\n\n'));
  }

  return true;
}
