'use strict';

var Watson      = require('../index.js');
var fs          = require('fs');
var astEquality = require('./helpers/ast-equality');

describe('Resource router mapping', function() {
  var baseDir = './tests/fixtures/resource-router-mapping';
  var watson;

  beforeEach(function() {
    watson = new Watson();
  });

  describe('convert resource to route with resetNamespace option', function() {
    it('transoform simple resource', function() {
      var source            = fs.readFileSync(baseDir + '/old-foos-route.js');
      var newSource         = watson._transformResourceRouterMapping(source);
      var expectedNewSource = fs.readFileSync(baseDir + '/new-foos-route.js');

      astEquality(newSource, expectedNewSource);
    });

    it('transform nested resources', function() {
      var source            = fs.readFileSync(baseDir + '/old-foos-bar-route.js');
      var newSource         = watson._transformResourceRouterMapping(source);
      var expectedNewSource = fs.readFileSync(baseDir + '/new-foos-bar-route.js');

      astEquality(newSource, expectedNewSource);
    });

    it('transform ember-cli file format', function() {
      var source            = fs.readFileSync(baseDir + '/old-ember-cli-sample.js');
      var newSource         = watson._transformResourceRouterMapping(source);
      var expectedNewSource = fs.readFileSync(baseDir + '/new-ember-cli-sample.js');

      astEquality(newSource, expectedNewSource);
    });
  });
});
