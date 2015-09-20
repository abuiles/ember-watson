var isImportFor = require('./helpers/is-import-for');
var parseAst    = require('../helpers/parse-ast');
var recast      = require('recast');
var types       = recast.types.namedTypes;
var builders    = recast.types.builders;

var addDefaultImport = require('./helpers/add-default-import');

function isEmberCall(node) {
  return types.MemberExpression.check(node.callee) &&
    node.callee.object.name === 'Ember';
}

function isLegacyDestroy(node) {
  return types.MemberExpression.check(node.callee) &&
    node.callee.object.name === 'Ember' &&
    node.callee.property.name === 'run' &&
    node.arguments[1].value === 'destroy';
}

function isStartAppAssignment(node) {
  return types.CallExpression.check(node.right) &&
    node.right.callee.name === 'startApp';
}

module.exports = function transform(source) {
  var ast = parseAst(source);
  var appName             = null;
  var addDestroyAppImport = false;
  var removeEmberImport   = true;
  var emberImport         = null;

  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.node;

      if(isLegacyDestroy(node)) {
        if (addDestroyAppImport !== true) {
          addDestroyAppImport = true;
        }

        path.replace(builders.callExpression(
          builders.identifier('destroyApp'),
          [appName]
        ));
      } else if (isEmberCall(node)) {
        removeEmberImport = false;
      }

      this.traverse(path);
    },
    visitImportDeclaration: function(path) {
      if (isImportFor('ember', path.node)) {
        emberImport = path;
      }

      this.traverse(path);
    },
    visitAssignmentExpression: function(path) {
      if (isStartAppAssignment(path.node)) {
        appName = path.node.left;
      }

      this.traverse(path);
    }
  });

  if (addDestroyAppImport) {
    addDefaultImport(ast, '../helpers/destroy-app', 'destroyApp');
  }

  if (removeEmberImport && emberImport) {
    emberImport.prune();
  }

  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
