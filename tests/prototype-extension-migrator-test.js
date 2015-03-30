var Watson = require('../index.js');
var fs = require('fs');
var astEquality = require('./helpers/ast-equality');
var recast = require('recast');

describe('computed properties and observers extending prototype', function() {
  it('makes the correct transformations', function() {
    var source = fs.readFileSync('./tests/fixtures/prototype-extension-files/old.js');
    var watson = new Watson();
    var newSource = watson._transformPrototypeExtensions(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/prototype-extension-files/new.js'));
  });
});
