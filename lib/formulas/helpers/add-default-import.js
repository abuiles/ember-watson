var builders = require('recast').types.builders;
var parseAst = require('../../helpers/parse-ast');

module.exports = function(ast, moduleName, identifier) {
  var importDefaultSpecifier = [builders.importDefaultSpecifier(
    builders.identifier(identifier)
  )];
  var importDeclaration = builders.importDeclaration(
    importDefaultSpecifier,
    builders.literal(moduleName)
  );

  ast.program.body.unshift(importDeclaration);

  return ast;
};
