'use strict';

var recast = require('recast');
var builders = recast.types.builders;
var types = recast.types.namedTypes;
var parseAst =  require('../helpers/parse-ast');

module.exports = function transformResourceRouterMapping(source) {
  var ast = parseAst(source);

  recast.visit(ast, {
    visitCallExpression: function (path) {
      var node = path.node;

      if (isRouter(node)) {
        var routes = node.arguments[0].body.body;
        traverseExpressions(routes);
        return false;
      } else {
        this.traverse(path);
      }
    }
  });

  return recast.print(ast, {tabWidth: 2, quote: 'single'}).code;
};

function traverseExpressions(routes) {
  routes.forEach(function (route) {
    if (isResourceRoute(route)) {
      transformResourceToRoute(route);
    }
    if (route.expression && types.CallExpression.check(route.expression)) {
      var lastArgument = route.expression.arguments[route.expression.arguments.length-1];
      if (types.FunctionExpression.check(lastArgument)) {
        traverseExpressions(lastArgument.body.body);
      }
    }
  });
}

function ensureOptionsObject(route) {
  var args = route.expression.arguments;
  var secondArg = args[1];

  if (secondArg && types.ObjectExpression.check(secondArg)) {
    return secondArg;
  }

  var optionsObject = builders.objectExpression([]);
  args.splice(1, 0, optionsObject);

  return optionsObject;
}

function transformResourceToRoute(route) {
  var expression = route.expression;
  var callee = expression.callee;
  var optionsObject = ensureOptionsObject(route);
  var resetNamespaceOption = builders.property(
    'init',
    builders.identifier('resetNamespace'),
    builders.literal(true)
  );

  callee.property.name = 'route';
  optionsObject.properties.push(resetNamespaceOption);
}

function isResourceRoute(route) {
  return types.ExpressionStatement.check(route) &&
    types.CallExpression.check(route.expression) &&
    types.MemberExpression.check(route.expression.callee) &&
    types.ThisExpression.check(route.expression.callee.object) &&
    types.Identifier.check(route.expression.callee.property) &&
    route.expression.callee.property.name === 'resource';
}

function isRouter(node) {
  var callee = node.callee;
  return types.MemberExpression.check(callee) &&
    types.Identifier.check(callee.property) &&
    callee.property.name === 'map';
}
