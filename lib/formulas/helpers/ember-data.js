'use strict';

var recast     = require('recast');
var types      = recast.types.namedTypes;

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

function isHasMany(node) {
  var mightBeHasMany;

  if (types.MemberExpression.check(node.callee)) {
    mightBeHasMany = node.callee.object.name === 'DS' &&
    node.callee.property.name === 'hasMany';
  } else if (types.Identifier.check(node.callee)) {
    mightBeHasMany = node.callee.name === 'hasMany';
  }

  return mightBeHasMany && isSupportedAssociationCall(node);
}

function isBelongsTo(node) {
  var mightBeBelongsTo;

  if (types.MemberExpression.check(node.callee)) {
    mightBeBelongsTo = node.callee.object.name === 'DS' &&
    node.callee.property.name === 'belongsTo';
  } else if (types.Identifier.check(node.callee)) {
    mightBeBelongsTo = node.callee.name === 'belongsTo';
  }

  return mightBeBelongsTo && isSupportedAssociationCall(node);
}

// First arguments is a string or a variable that is capitalized
function isSupportedStoreCall(node) {
  var firstArg;
  if (node.arguments.length) {
    firstArg = node.arguments[0];
    if (types.Literal.check(firstArg)) {
      return typeof firstArg.value === 'string';
    } else if (types.Identifier.check(firstArg)) {
      return firstArg.name[0] === firstArg.name[0].toUpperCase();
    }
  }
  return false;
}

// First arguments is a string, or a variable that is capitalized, or a member expression.
function isSupportedAssociationCall(node) {
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

function isStoreMethod(node) {
  var maybeStoreMethod;
  if (types.MemberExpression.check(node.callee)) {
    maybeStoreMethod = node.callee.object.property && node.callee.object.property.name === 'store' &&
    STORE_METHODS.indexOf(node.callee.property.name) >= 0;
  }
  return maybeStoreMethod && isSupportedStoreCall(node);
}

module.exports = {
  isHasMany: isHasMany,
  isBelongsTo: isBelongsTo,
  isRelationshipMacro: isRelationshipMacro,
  isStoreMethod: isStoreMethod,
};
