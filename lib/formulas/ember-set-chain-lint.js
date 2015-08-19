'use strict';

var recast     = require('recast');
var builders   = recast.types.builders;
var types      = recast.types.namedTypes;

module.exports = function lintEmberSetChain(source){
  var results = [];

  var ast = recast.parse(source);
  var sourceLines = source.split(/\r\n?|\n/);
  var marginWidth = (sourceLines.length + 1).toString().length;

  recast.visit(ast, {
    visitCallExpression: function(path) {
      if (isSetCallExpression(path)) {
        var node = path.node;
        var parentNode = path.parent.node;

        if (!types.ExpressionStatement.check(parentNode)) {
          results.push("Using the return value of `set`:\n\n" + getCodeFrame(node));
        }
      }

      this.traverse(path);
    }
  });

  function isSetCallExpression(path) {
    var callee = path.node.callee;

    return (
      types.MemberExpression.check(callee) &&
      types.Identifier.check(callee.property) &&
      callee.property.name === 'set'
    );
  }

  function getCodeFrame(node) {
    var nodeStartLine = node.loc.start.line;
    var nodeEndLine = node.loc.end.line;

    var startLine = Math.max(nodeStartLine - 1, 1);
    var endLine = Math.min(nodeEndLine + 2, sourceLines.length + 1);

    var codeFrame = "";

    for (var i = startLine; i <= nodeEndLine; i++) {
      codeFrame += " " + justifyColumn(i) + " | "  + sourceLines[i-1] + "\n";
    }

    var cursorStart = Math.min(node.loc.start.column, node.loc.end.column);
    var cursorEnd = Math.max(node.loc.start.column, node.loc.end.column);

    codeFrame += " " + repeat(" ", marginWidth) + " | ";
    codeFrame += repeat(" ", cursorStart);
    codeFrame += repeat("^", cursorEnd - cursorStart);
    codeFrame += "\n";

    for (i = nodeEndLine + 1; i < endLine; i++) {
      codeFrame += " " + justifyColumn(i) + " | "  + sourceLines[i-1] + "\n";
    }

    return codeFrame;
  }

  function repeat(char, times) {
    var out = "";
    while (times-- > 0) { out += char; }
    return out;
  }

  function justifyColumn(n) {
    return repeat(" ", marginWidth - n.toString().length) + n;
  }

  return results;
};
