'use strict';

var recast     = require('recast');
var builders   = recast.types.builders;
var types      = recast.types.namedTypes;
var emberData  = require('./helpers/ember-data');
var parseAst   = require('../helpers/parse-ast');

module.exports = function transformEmberDataAsyncFalseRelationship(source) {
  var ast = parseAst(source);

  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.node;

      if(emberData.isRelationshipMacro(node)) {
        replaceArguments(path);
      }

      this.traverse(path);
    }
  });

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

    if (hasImplicitAsync(node)) {
      var rebuilt = builders.callExpression(node.callee, rebuildArguments(node.arguments));
      path.replace(rebuilt);
    }
  }

  // Returns true if the call does not contain an options object
  // or, if there is one, there is no asyn option in it.
  function hasImplicitAsync(node) {
    var args = node.arguments;

    if (args.length >= 2) {
      var keyNames = getKeyNamesFromObjectExpression(args[1]);

      return keyNames.indexOf('async') < 0;
    } else {
      return true;
    }
  }

  // Return the names of the properties only if they are identifiers
  function getKeyNamesFromObjectExpression(objExp) {
    if (types.ObjectExpression.check(objExp)) {
      var names = [];
      var props = objExp.properties;

      for (var i = 0, len = props.length; i < len; i++) {
        if (types.Identifier.check(props[i].key)) {
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
