'use strict';

var parseAST = require('../helpers/parse-ast');
var recast = require('recast');

module.exports = function(source) {
  var ast = parseAST(source);

  recast.visit(ast, {

    visitCallExpression: function(path) {
      var callee = path.node.callee;
      if (callee.type === 'MemberExpression' &&
          callee.property &&
          callee.property.name === 'extend' &&
          callee.object &&
          callee.object.property &&
          /serializer/i.test(callee.object.property.name)) {
        this.traverse(path);
        return;
      }

      return false;
    },

    visitProperty: function(path) {
      if (path.node.key.name === 'isNewSerializerAPI') {
        path.prune();
      }
      return false;
    }
  });

  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
