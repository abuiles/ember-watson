var Watson = require('../index.js');
var fs = require('fs');
var astEquality = require('./helpers/ast-equality');
var recast = require('recast');


// skip if import { module, test } from 'qunit' is defined
// add import { module, test } from 'qunit' if ember-qunit is not used
// or include skip if used
// if is component test, replace this.append(); with this.render();


describe('Qunit tests with ember-qunit', function() {
  it('makes the correct transformations', function() {
    var source = fs.readFileSync('./tests/fixtures/qunit-files/old-with-ember-qunit.js');
    var watson = new Watson();
    var newSource = watson._transformQUnitTest(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/qunit-files/new-with-ember-qunit.js'));
  });
});

describe('Qunit tests only with qunit', function() {
  it('makes the correct transformations', function() {
    var source = fs.readFileSync('./tests/fixtures/qunit-files/old-with-qunit.js');
    var watson = new Watson();
    var newSource = watson._transformQUnitTest(source);

    astEquality(newSource, fs.readFileSync('./tests/fixtures/qunit-files/new-with-qunit.js'));
  });
});
