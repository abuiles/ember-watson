'use strict';

var Watson      = require('../index.js');
var fs          = require('fs');
var astEquality = require('./helpers/ast-equality');

describe('ember data async false relationships', function() {
  var baseDir = './tests/fixtures/ember-data-async-false-relationships';
  var watson;

  beforeEach(function() {
    watson = new Watson();
  });

  describe('hasMany relationship macro', function() {

    it('adds explicit async: false to options', function() {
        var source            = fs.readFileSync(baseDir + '/has-many-old.js');
        var newSource         = watson._transformEmberDataAsyncFalseRelationships(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/has-many-new.js');

        astEquality(newSource, expectedNewSource);
    });
  });

  describe('belongsTo relationship macro', function() {

    it('adds explicit async: false to options', function() {
        var source            = fs.readFileSync(baseDir + '/belongs-to-old.js');
        var newSource         = watson._transformEmberDataAsyncFalseRelationships(source);
        var expectedNewSource = fs.readFileSync(baseDir + '/belongs-to-new.js');

        astEquality(newSource, expectedNewSource);
    });
  });
});
