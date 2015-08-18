var recast      = require('recast');
var builders    = recast.types.builders;
var types       = recast.types.namedTypes;
var isImportFor = require('./helpers/is-import-for');
var parseAst    = require('../helpers/parse-ast');

function isNotES6Method(node) {
  return types.Property.check(node) &&
         types.FunctionExpression.check(node.value) &&
         !node.method;
}

function makeES6Method(path) {
  var node = path.node;
  node.method = true;
}

module.exports = function transform(source) {
  var ast = parseAst(source);

  recast.visit(ast, {
    visitProperty: function(path) {
      if(isNotES6Method(path.node)) {
        makeES6Method(path);
      }
      this.traverse(path);
    }
  });

  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
