var chalk    = require('chalk');
var fs       = require('fs');
var path     = require('path');

var qunitTransforms = require('./formulas/qunit-transforms');
var walkSync        = require('walk-sync');

module.exports = EmberWatson;

function EmberWatson() { }

EmberWatson.prototype._transformQUnitTest = qunitTransforms;

EmberWatson.prototype.transformQUnitTest = function(testsPath) {
  var paths    = walkSync(testsPath);
  var tests  = [];
  var wontFix = [];

  paths.forEach(function(file) {
    if (path.extname(file) === '.js' && file.indexOf('-test.js') > 0) {
      tests.push(path.join(testsPath,file));
    }
  });

  tests.forEach(function(testFile) {
    var source = fs.readFileSync(testFile);
    try {
      var newSource = this._transformQUnitTest(source);
      if (source != newSource) {
        console.log(chalk.green('Fixed: ', testFile));

        fs.writeFileSync(testFile, newSource);
      }
    } catch (err) {
      wontFix.push(testFile);
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
};
