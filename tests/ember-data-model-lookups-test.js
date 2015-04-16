'use strict';

var Watson      = require('../index.js');
var fs          = require('fs');
var astEquality = require('./helpers/ast-equality');
var recast      = require('recast');

describe('ember data model lookups', function(){
  var baseDir = './tests/fixtures/ember-data-model-lookups';
  var watson;

  beforeEach(function(){
    watson = new Watson();
  });

  describe('hasMany relationship macro', function(){

    describe('when using the string form', function(){
      it('migrates to dasherized', function(){
        var source            = fs.readFileSync(baseDir + '/old.js');
        var newSource         = watson._transformEmberDataModelLookups(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/new.js');

        astEquality(newSource, expectedNewSource);
      });
    });

    describe('when using the object form', function(){

      it('migrates to a dasherized string', function(){
        var source         = fs.readFileSync(baseDir + '/app-global-old.js');
        var newSource      = watson._transformEmberDataModelLookups(source);
        var expectedSource = fs.readFileSync(baseDir + '/app-global-new.js');

        astEquality(newSource, expectedNewSource);
      });
    });

  });

});

