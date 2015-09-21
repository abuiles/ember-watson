var Watson = require('../index.js');
var fs = require('fs');
var astEquality = require('./helpers/ast-equality');
var recast = require('recast');

describe('convert acceptance tests to use destroy-app helper', function() {
  it('makes the correct transformations - qunit', function() {
    var source = fs.readFileSync('./tests/fixtures/destroy-app-transform/old-default-qunit.js');
    var watson = new Watson();
    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/destroy-app-transform/new-default-qunit.js'));
  });

  it('makes the correct transformations - mocha', function() {
    var source = fs.readFileSync('./tests/fixtures/destroy-app-transform/old-default-mocha.js');
    var watson = new Watson();
    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/destroy-app-transform/new-default-mocha.js'));
  });

  it('does not remove ember import if otherwise used in test - qunit', function() {
    var source = fs.readFileSync('./tests/fixtures/destroy-app-transform/old-with-ember-usage-qunit.js');
    var watson = new Watson();
    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/destroy-app-transform/new-with-ember-usage-qunit.js'));
  });

  it('does not remove ember import if otherwise used in test - mocha', function() {
    var source = fs.readFileSync('./tests/fixtures/destroy-app-transform/old-with-ember-usage-mocha.js');
    var watson = new Watson();
    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/destroy-app-transform/new-with-ember-usage-mocha.js'));
  });

  it('can handle a non-standard application name - qunit', function() {
    var source = fs.readFileSync('./tests/fixtures/destroy-app-transform/old-crazy-app-name-qunit.js');
    var watson = new Watson();
    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/destroy-app-transform/new-crazy-app-name-qunit.js'));
  });

  it('can handle a non-standard application name - mocha', function() {
    var source = fs.readFileSync('./tests/fixtures/destroy-app-transform/old-crazy-app-name-mocha.js');
    var watson = new Watson();
    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/destroy-app-transform/new-crazy-app-name-mocha.js'));
  });
});
