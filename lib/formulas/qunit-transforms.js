var recast   = require('recast');
var builders = recast.types.builders;

var ASSERTIONS = [
  'async',
  'deepEqual',
  'equal',
  'expect',
  'notDeepEqual',
  'notEqual',
  'notPropEqual',
  'notStrictEqual',
  'ok',
  'propEqual',
  'push',
  'strictEqual',
  'throws',
];

function isModule(node) {
  return node.expression.type === 'CallExpression' &&
    node.expression.callee.name === 'module';
}

function isTest(node) {
  return node.expression.type === 'CallExpression' &&
    node.expression.callee.name === 'test';
}

function isSkip(node) {
  return node.expression.type === 'CallExpression' &&
    node.expression.callee.name === 'skip';
}

function isAssertion(node) {
  return node.expression.type === 'CallExpression' &&
    ASSERTIONS.indexOf(node.expression.callee.name) != -1;
}

function isImportFor(module, node) {
  return node.source.type === 'ModuleSpecifier' &&
    node.source.value === module;
}

function transformModule(node) {
  var callExpression = node.expression;
  if (callExpression.arguments.length > 1 &&
      callExpression.arguments[1].type === 'ObjectExpression') {
    callExpression.arguments[1].properties.forEach(function(node) {
      if (node.key.name === 'setup') {
        node.key.name = 'beforeEach';
      }
      if (node.key.name === 'teardown') {
        node.key.name = 'afterEach';
      }
    });
  }
}

function transformTestStatement(node) {
  if (node.expression.arguments.length > 1) {
    var callback = node.expression.arguments[1];

    if (callback.type === 'FunctionExpression') {
      if (callback.params.length === 0) {
        callback.params.push(builders.identifier('assert'));
      }
    }
  }
}

function transformAssertions(node) {
  node.expression.callee.name = 'assert.' + node.expression.callee.name;
}

function addEmberQunitImport(ast, withSkip) {
  var firstImport = ast.program.body.shift();
  var specifiers = [
    builders.importSpecifier(builders.identifier('module')),
    builders.importSpecifier(builders.identifier('test'))
  ];

  if (withSkip) {
    specifiers.push(builders.importSpecifier(builders.identifier('skip')));
  }

  var emberQUnitImport = builders.importDeclaration(
    specifiers,
    builders.moduleSpecifier('qunit')
  );

  ast.program.body.unshift(emberQUnitImport);
  ast.program.body.unshift(firstImport);
}


module.exports = function transform(source) {
  var sections = {
    addQUnitImport: true,
    modules: [],
    tests: [],
    skips: [],
    assertions: []
  };

  var ast = recast.parse(source);

  recast.visit(ast, {
    visitExpressionStatement: function(path) {
      var node = path.node;

      if (isModule(node)) {
        sections.modules.push(node);
      }

      if (isTest(node)) {
        sections.tests.push(node);
      }

      if (isSkip(node)) {
        sections.skips.push(node);
      }

      if (isAssertion(node)) {
        sections.assertions.push(node);
      }
      this.traverse(path);
    },
    visitImportDeclaration: function(path) {

      if (isImportFor('ember-qunit', path.node)) {
        sections.addQUnitImport = false;
      }

      if (isImportFor('qunit', path.node)) {
        sections.addQUnitImport = false;
      }

      this.traverse(path);
    }
  });

  sections.modules.forEach(function(qunitModule) {
    transformModule(qunitModule);
  });

  sections.tests.forEach(function(node) {
    transformTestStatement(node);
  });

  sections.skips.forEach(function(node) {
    transformTestStatement(node);
  });

  sections.assertions.forEach(function(node) {
    transformAssertions(node);
  });

  if (sections.addQUnitImport) {
    addEmberQunitImport(ast, sections.skips.length > 0);
  }

  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
