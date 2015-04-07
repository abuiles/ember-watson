var Watson = require('../index.js');
var fs = require('fs');
var astEquality = require('./helpers/ast-equality');
var recast = require('recast');

describe('computed properties, observers and event observers extending prototype', function() {
  it('makes the correct transformations', function() {
    var source = fs.readFileSync('./tests/fixtures/prototype-extension-files/old.js');
    var watson = new Watson();
    var newSource = watson._transformPrototypeExtensions(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/prototype-extension-files/new.js'));
  });

  it('includes Ember if not imported', function() {
    var source = fs.readFileSync('./tests/fixtures/prototype-extension-files/old-without-ember.js');
    var watson = new Watson();
    var newSource = watson._transformPrototypeExtensions(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/prototype-extension-files/new-with-ember.js'));
  });

  it('includes Ember only if transformations are made', function() {
    var source = fs.readFileSync('./tests/fixtures/prototype-extension-files/simple.js');
    var watson = new Watson();
    var newSource = watson._transformPrototypeExtensions(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/prototype-extension-files/simple.js'));
  });
});
