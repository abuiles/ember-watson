'use strict';

var recast     = require('recast');
var builders   = recast.types.builders;
var types      = recast.types.namedTypes;

module.exports = function transformEmberDataAsyncFalseRelationship(source) {
  var ast = recast.parse(source);

  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.node;

      if(isRelationshipMacro(node)) {
        replaceArguments(path);
      }

      this.traverse(path);
    },
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

  function asyncProperty() {
    var async = builders.identifier('async');
    var False = builders.literal(false);

    return builders.property('init', async, False);
  }

  function rebuildArguments(args) {
    var reargs        = args.slice();
    var options = reargs[1] || builders.objectExpression([]);

    options.properties.push(asyncProperty());

    reargs[1] = options;

    return reargs;
  }

  function replaceArguments(path) {
    var node = path.node;

    if(hasImplicitAsync(node)) {
      var rebuilt = builders.callExpression(node.callee, rebuildArguments(node.arguments));
      path.replace(rebuilt);
    }
  }

  // Returns true if the call does not contain an options object
  // or, if there is one, there is no asyn option in it.
  function hasImplicitAsync(node) {
    var args = node.arguments;

    if(args.length >= 2) {
      var keyNames = getKeyNamesFromObjectExpression(args[1]);

      return keyNames.indexOf('async') < 0;
    } else {
      return true;
    }
  }

  // Return the names of the properties only if they are identifiers
  function getKeyNamesFromObjectExpression(objExp) {
    if(types.ObjectExpression.check(objExp)) {
      var names = [];
      var props = objExp.properties;

      for(var i = 0, len = props.length; i < len; i++) {
        if(types.Identifier.check(props[i].key)) {
          names.push(props[i].key.name);
        }
      }

      return names;
    } else {
      return [];
    }
  }

  return recast.print(ast, {tabWidth: 2, quote: 'single'}).code;
};
