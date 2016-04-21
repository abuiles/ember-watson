"use strict";

var Watson      = require('../index.js');
var fs          = require('fs');
var astEquality = require('./helpers/ast-equality');
var recast      = require('recast');


describe('ember data isNewSerializerAPI', function(){
  var baseDir = './tests/fixtures/remove-ember-data-is-new-serializer-api';
  var watson;

  beforeEach(function(){
    watson = new Watson();
  });

  describe('removing isNewSerializerAPI literals', function() {

    it('removes the isNewSerializerAPI directive', function() {
      var source            = fs.readFileSync(baseDir + '/old/serializer.js');
      var newSource         = watson._removeEmberDataIsNewSerializerAPI(source);
      var expectedNewSource = fs.readFileSync(baseDir + '/new/serializer.js');

      astEquality(newSource, expectedNewSource);
    });
  });
});
