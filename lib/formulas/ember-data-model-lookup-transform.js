'use strict';

var recast     = require('recast');
var builders   = recast.types.builders;
var types      = recast.types.namedTypes;
var Inflected  = require('inflected');
var underscore = Inflected.underscore.bind(Inflected);
var dasherize  = Inflected.dasherize.bind(Inflected);
var emberData  = require('./helpers/ember-data');
var parseAst  = require('../helpers/parse-ast');

function normalize(string) {
  return dasherize(underscore(string));
}

module.exports = function transformEmberDataModelLookups(source){
  var ast = parseAst(source);


  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.node;

      if (emberData.isRelationshipMacro(node)) {
        replaceArguments(path);
      }

      if (emberData.isStoreMethod(node)) {
        replaceArguments(path);
      }

      this.traverse(path);
    }
  });

  function rebuildArguments(args) {
    var reargs        = args.slice();
    var modelNameNode = reargs[0];
    var modelName = normalize(extractName(modelNameNode));

    var newModelNameNode = builders.literal(modelName);
    reargs[0] = newModelNameNode;

    return reargs;
  }

  function replaceArguments(path) {
    var node = path.node;

    var rebuilt = builders.callExpression(node.callee, rebuildArguments(node.arguments));
    path.replace(rebuilt);
  }

  function extractName(node) {
    var modelName = '';

    if (types.Literal.check(node)) {
      modelName     = normalize(node.value);
    } else if (types.MemberExpression.check(node)) {
      modelName     = normalize(node.property.name);
    } else if (types.Identifier.check(node)) {
      modelName     = normalize(node.name);
    }

    return modelName;
  }

  return recast.print(ast, {tabWidth: 2, quote: 'single'}).code;
};
