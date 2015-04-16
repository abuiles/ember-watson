'use strict';

var Watson      = require('../index.js');
var fs          = require('fs');
var astEquality = require('./helpers/ast-equality');
var recast      = require('recast');

describe('ember data model lookups', function(){
  var baseDir = './tests/fixtures/ember-data-model-lookups';

  describe('hasMany relationship macro', function(){

    it('migrates to dasherized', function(){
      var source            = fs.readFileSync(baseDir + '/old.js');
      var watson            = new Watson();
      var newSource         = watson._transformEmberDataModelLookups(source);
      var expectedNewSource = fs.readFileSync(baseDir + '/new.js');

      astEquality(newSource, expectedNewSource);
    });
  });

});

