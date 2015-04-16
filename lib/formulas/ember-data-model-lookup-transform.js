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

      if (isHasMany(node)) {
        replaceArguments(path);
      }

      this.traverse(path);
    }
  });

  function isHasMany(node) {
    return types.MemberExpression.check(node.callee) &&
      node.callee.object.name === 'DS' &&
      node.callee.property.name === 'hasMany';
  }

  function rebuildArguments(args) {
    var reargs        = args.slice();
    var modelNameNode = reargs[0];
    var modelName;

    if (types.Literal.check(modelNameNode)) {
      modelName     = normalize(modelNameNode.value);
    } else if (types.MemberExpression.check(modelNameNode)) {
      modelName     = normalize(modelNameNode.property.name);
    }

    var newModelNameNode = builders.literal(modelName);
    reargs[0] = newModelNameNode;

    return reargs;
  }

  function replaceArguments(path) {
    var node = path.node;

    var rebuilt = builders.callExpression(node.callee, rebuildArguments(node.arguments));
    path.replace(rebuilt);
  }

  return recast.print(ast, {tabWidth: 2, quote: 'single'}).code;
};
