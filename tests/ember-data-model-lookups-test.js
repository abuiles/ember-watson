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

  describe('store methods', function(){
    it('migrates to a string', function(){
      var source            = fs.readFileSync(baseDir + '/route-old.js');
      var newSource         = watson._transformEmberDataModelLookups(source);
      var expectedNewSource = fs.readFileSync(baseDir + '/route-new.js');

      astEquality(newSource, expectedNewSource);
    });

    it('does\'t transform member expressions passed as first argument', function(){
      var source            = fs.readFileSync(baseDir + '/serializer-old.js');
      var newSource         = watson._transformEmberDataModelLookups(source);
      var expectedNewSource = fs.readFileSync(baseDir + '/serializer-new.js');

      astEquality(newSource, expectedNewSource);
    });
  });

  describe('hasMany relationship macro', function(){

    describe('when using the string form', function(){
      it('migrates to dasherized', function(){
        var source            = fs.readFileSync(baseDir + '/has-many-string-old.js');
        var newSource         = watson._transformEmberDataModelLookups(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/has-many-string-new.js');

        astEquality(newSource, expectedNewSource);
      });
    });

    describe('when using the object form', function(){

      it('migrates to a dasherized string', function(){
        var source            = fs.readFileSync(baseDir + '/app-global-old.js');
        var newSource         = watson._transformEmberDataModelLookups(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/app-global-new.js');

        astEquality(newSource, expectedNewSource);
      });
    });

    describe('when using a variable', function(){
      it('migrates to a dasherized string', function(){
        var source            = fs.readFileSync(baseDir + '/has-many-variable-old.js');
        var newSource         = watson._transformEmberDataModelLookups(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/has-many-variable-new.js');

        astEquality(newSource, expectedNewSource);
      });
    });

    describe('when hasMany itself is a variable', function(){

      it('migrates to a dasherized string', function(){
        var source            = fs.readFileSync(baseDir + '/has-many-function-variable-old.js');
        var newSource         = watson._transformEmberDataModelLookups(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/has-many-function-variable-new.js');

        astEquality(newSource, expectedNewSource);
      });
    });
  });

  describe('belongsTo relationship macro', function(){

    describe('when using the string form', function(){

      it('migrates to a dasherized string', function(){
        var source            = fs.readFileSync(baseDir + '/belongs-to-string-old.js');
        var newSource         = watson._transformEmberDataModelLookups(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/belongs-to-string-new.js');

        astEquality(newSource, expectedNewSource);
      });
    });

    describe('when using the variable form', function(){

      it('migrates to a dasherized string', function(){
        var source            = fs.readFileSync(baseDir + '/belongs-to-variable-old.js');
        var newSource         = watson._transformEmberDataModelLookups(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/belongs-to-variable-new.js');

        astEquality(newSource, expectedNewSource);
      });
    });

    describe('when using the MemberExpression form', function(){

      it('migrates to a dasherized string', function(){
        var source            = fs.readFileSync(baseDir + '/belongs-to-member-expression-old.js');
        var newSource         = watson._transformEmberDataModelLookups(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/belongs-to-member-expression-new.js');

        astEquality(newSource, expectedNewSource);
      });
    });

    describe('when belongsTo itself is a variable', function(){

      it('migrates to a dasherized string', function(){
        var source            = fs.readFileSync(baseDir + '/belongs-to-function-variable-old.js');
        var newSource         = watson._transformEmberDataModelLookups(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/belongs-to-function-variable-new.js');

        astEquality(newSource, expectedNewSource);
      });
    });
  });

});

