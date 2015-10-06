var Watson = require('../index.js');
var fs = require('fs');
var astEquality = require('./helpers/ast-equality');

describe('replacing deprecated needs with controller injection', function() {

  it('replaces single needs', function() {
    var source = fs.readFileSync('./tests/fixtures/replace-needs-with-injection/single.js');
    var watson = new Watson();
    var newSource = watson._replaceNeedsWithInjection(source);
    astEquality(newSource, fs.readFileSync('./tests/fixtures/replace-needs-with-injection/single-result.js'));
  });

  it('replaces needs arrays', function() {
    var source = fs.readFileSync('./tests/fixtures/replace-needs-with-injection/array.js');
    var watson = new Watson();
    var newSource = watson._replaceNeedsWithInjection(source);
    astEquality(newSource, fs.readFileSync('./tests/fixtures/replace-needs-with-injection/array-result.js'));
  });

  it('dedupes controller names', function() {
    var source = fs.readFileSync('./tests/fixtures/replace-needs-with-injection/array.js');
    var watson = new Watson();
    var newSource = watson._replaceNeedsWithInjection(source);
    astEquality(newSource, fs.readFileSync('./tests/fixtures/replace-needs-with-injection/array-result.js'));
  });

  it('replaces uses', function() {
    var source = fs.readFileSync('./tests/fixtures/replace-needs-with-injection/uses.js');
    var watson = new Watson();
    var newSource = watson._replaceNeedsWithInjection(source);
    astEquality(newSource, fs.readFileSync('./tests/fixtures/replace-needs-with-injection/uses-result.js'));
  });

  it('adds an import if needed', function() {
    var source = fs.readFileSync('./tests/fixtures/replace-needs-with-injection/no-ember-import.js');
    var watson = new Watson();
    var newSource = watson._replaceNeedsWithInjection(source);
    astEquality(newSource, fs.readFileSync('./tests/fixtures/replace-needs-with-injection/no-ember-import-result.js'));
  });
});