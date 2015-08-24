'use strict';

var Watson      = require('../index.js');
var fs          = require('fs');
var chai        = require('chai');

describe('find overloaded CPs', function() {
  var baseDir = './tests/fixtures/find-overloaded-cps';
  var watson;

  beforeEach(function() {
    watson = new Watson();
  });

  it('has expected JSON output', function() {
    var searcher = watson.findOverloadedCPs(baseDir + '/input');
    var expectedReport = JSON.parse(fs.readFileSync(baseDir + '/output/report.json'));
    chai.expect(searcher.findings).to.deep.equal(expectedReport);
  });

});
