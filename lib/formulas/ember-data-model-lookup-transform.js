'use strict';

var recast     = require('recast');
var builders   = recast.types.builders;
var types      = recast.types.namedTypes;
var Inflected  = require('inflected');
var underscore = Inflected.underscore.bind(Inflected);
var dasherize  = Inflected.dasherize.bind(Inflected);

function normalize(string) {
  return dasherize(underscore(string));
}

module.exports = function transformEmberDataModelLookups(source){
  var ast = recast.parse(source);

  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.node;

      if (isRelationshipMacro(node)) {
        replaceArguments(path);
      }

      this.traverse(path);
    }
  });

  function isHasMany(node) {
    if (types.MemberExpression.check(node.callee)) {
      return node.callee.object.name === 'DS' &&
        node.callee.property.name === 'hasMany';
    } else if (types.Identifier.check(node.callee)) {
      return node.callee.name === 'hasMany';
    }
    return false;
  }

  function isBelongsTo(node) {
    if (types.MemberExpression.check(node.callee)) {
      return node.callee.object.name === 'DS' &&
        node.callee.property.name === 'belongsTo';
    } else if (types.Identifier.check(node.callee)) {
      return node.callee.name === 'belongsTo';
    }
    return false;
  }

  function isRelationshipMacro(node) {
    return isHasMany(node) || isBelongsTo(node);
  }

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
