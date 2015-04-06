var builders = require('recast').types.builders;

module.exports = function(ast, moduleName, identifier) {
  var importDefaultSpecifier = [builders.importDefaultSpecifier(
    builders.identifier(identifier)
  )];
  var importDeclaration = builders.importDeclaration(
    importDefaultSpecifier,
    builders.moduleSpecifier(moduleName)
  );

  ast.program.body.unshift(importDeclaration);

  return ast;
};
