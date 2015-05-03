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

  var STORE_METHODS = [
    'all',
    'createRecord',
    'filter',
    'find',
    'fetch',
    'fetchAll',
    'findById',
    'findByIds',
    'findQuery',
    'getById',
    'hasRecordForId',
    'metaForType',
    'modelFor',
    'modelFactoryFor',
    'normalize',
    'push',
    'pushMany',
    'pushPayload',
    'recordForId',
    'recordIsLoaded',
    'update',
    'serializerFor',
    'setMetadataFor',
    'unloadAll'
  ];

  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.node;

      if (isRelationshipMacro(node)) {
        replaceArguments(path);
      }

      if (isStoreMethod(node)) {
        replaceArguments(path);
      }

      this.traverse(path);
    }
  });

  function isHasMany(node) {
    var mightBeHasMany;

    if (types.MemberExpression.check(node.callee)) {
      mightBeHasMany = node.callee.object.name === 'DS' &&
        node.callee.property.name === 'hasMany';
    } else if (types.Identifier.check(node.callee)) {
      mightBeHasMany = node.callee.name === 'hasMany';
    }

    return mightBeHasMany && isSupportedModelCall(node);
  }

  function isBelongsTo(node) {
    var mightBeBelongsTo;

    if (types.MemberExpression.check(node.callee)) {
      mightBeBelongsTo = node.callee.object.name === 'DS' &&
        node.callee.property.name === 'belongsTo';
    } else if (types.Identifier.check(node.callee)) {
      mightBeBelongsTo = node.callee.name === 'belongsTo';
    }

    return mightBeBelongsTo && isSupportedModelCall(node);
  }

  // First arguments is a string, or a variable that is capitalized, or a member expression.
  function isSupportedModelCall(node) {
    var firstArg;
    if (node.arguments.length) {
      firstArg = node.arguments[0];
      if (types.Literal.check(firstArg)) {
        return typeof firstArg.value === 'string';
      } else if (types.Identifier.check(firstArg)) {
        return firstArg.name[0] === firstArg.name[0].toUpperCase();
      }
      return types.MemberExpression.check(firstArg);
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


  function isStoreMethod(node) {
    var maybeStoreMethod;
    if (types.MemberExpression.check(node.callee)) {
      maybeStoreMethod = node.callee.object.property && node.callee.object.property.name === 'store' &&
        STORE_METHODS.indexOf(node.callee.property.name) >= 0;
    }
    return maybeStoreMethod && isSupportedModelCall(node);
  }

  return recast.print(ast, {tabWidth: 2, quote: 'single'}).code;
};
