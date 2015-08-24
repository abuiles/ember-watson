var recast      = require('recast');
var types       = recast.types.namedTypes;
var parseAst    = require('../helpers/parse-ast');
var chalk     = require('chalk');

function Searcher(reportFormat) {
  this.reportFormat = reportFormat;
  this.findings = [];
  this.sources = {};
}

function isPrototypeExtendedCP(node){
  return types.MemberExpression.check(node.callee) &&
    types.Identifier.check(node.callee.property) &&
    node.callee.property.name === 'property' &&
    types.FunctionExpression.check(node.callee.object);
}

function moreThanArityOne(node) {
  return types.FunctionExpression.check(node) && node.params.length > 1;
}

function isFunctionExpressionCP(node) {
  return node.callee.name === 'computed' || (
    node.callee.type === 'MemberExpression' &&
      node.callee.property.name === 'computed'
  );
}

function any(list, predicate) {
  for (var i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      return true;
    }
  }
  return false;
}

Searcher.prototype.examineSource = function(source, filename) {
  var ast = parseAst(source);
  var searcher = this;
  recast.visit(ast, {
    visitCallExpression: function(path) {
      if ((isPrototypeExtendedCP(path.node) && moreThanArityOne(path.node.callee.object)) ||
          (isFunctionExpressionCP(path.node) && any(path.node.arguments, moreThanArityOne))
         ) {
        searcher.sources[filename] = source.toString();
        searcher.findings.push({
          filename: filename,
          loc: {
            start: path.node.loc.start,
            end: path.node.loc.end
          }
        });
         }
      this.traverse(path);
    }
  });
};

Searcher.prototype.outputSummary = function(reportFormat) {
  if (reportFormat === 'json') {
    console.log(JSON.stringify(this.findings, null, 2));
    return;
  }
  var searcher = this;
  this.findings.forEach(function(finding) {
    searcher.printFinding(finding);
  });
};

Searcher.prototype.printFinding = function(finding) {
  console.log(chalk.green(finding.filename + ':' + finding.loc.start.line));
  var lines = this.sources[finding.filename].split(/\r|\n/).slice(finding.loc.start.line - 1, finding.loc.end.line);
  console.log(lines.join("\n"));
};

module.exports = Searcher;
