var recast      = require('recast');
var builders    = recast.types.builders;
var types       = recast.types.namedTypes;
var isImportFor = require('./helpers/is-import-for');
var parseAst = require('../helpers/parse-ast');

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
  return types.CallExpression.check(node.expression) &&
    (
      node.expression.callee.name === 'module' ||
      (
        node.expression.callee.type === 'MemberExpression' &&
        node.expression.callee.object.name === 'QUnit' &&
        node.expression.callee.property.name === 'module'
      )
    );
}

function isTest(node) {
  return types.CallExpression.check(node.expression) &&
    (
      node.expression.callee.name === 'test' ||
      (
        node.expression.callee.type === 'MemberExpression' &&
        node.expression.callee.object.name === 'QUnit' &&
        node.expression.callee.property.name === 'test'
      )
    );
}

function isSkip(node) {
  return types.CallExpression.check(node.expression) &&
    (
      node.expression.callee.name === 'skip' ||
      (
        node.expression.callee.type === 'MemberExpression' &&
        node.expression.callee.object.name === 'QUnit' &&
        node.expression.callee.property.name === 'skip'
      )
    );
}

function hasAssertions(node) {
  var assertions = [];
  recast.visit(node, {
    visitExpressionStatement: function(path) {
      var node = path.node;
      if (isAssertion(node)) {
        assertions.push(node);
      }
      this.traverse(path);
    }
  });
  return assertions.length > 0;
}

function isAssertion(node) {
  return types.CallExpression.check(node.expression) &&
    ASSERTIONS.indexOf(node.expression.callee.name) != -1;
}

function transformModule(node) {
  var callExpression = node.expression;
  if (callExpression.arguments.length > 1 &&
      types.ObjectExpression.check(callExpression.arguments[1])) {
    callExpression.arguments[1].properties.forEach(function(node) {
      if (node.key.name === 'setup') {
        node.key.name = 'beforeEach';
        if (hasAssertions(node)) {
          transformTestCallback(node.value);
        }
      }
      if (node.key.name === 'teardown') {
        node.key.name = 'afterEach';
        if (hasAssertions(node)) {
          transformTestCallback(node.value);
        }
      }
    });
  }
}

function transformTestStatement(node) {
  if (node.expression.arguments.length > 1) {
    transformTestCallback(node.expression.arguments[1]);
  }
}

function transformTestCallback(callback){
  if (types.FunctionExpression.check(callback) || types.ArrowFunctionExpression.check(callback)) {
    if (callback.params.length === 0) {
      callback.params.push(builders.identifier('assert'));
    }
  }
}

function transformAssertions(node) {
  node.expression.callee.name = 'assert.' + node.expression.callee.name;
}

function addEmberQunitImport(ast, withSkip) {
  var specifiers = [
    builders.importSpecifier(builders.identifier('module')),
    builders.importSpecifier(builders.identifier('test'))
  ];

  if (withSkip) {
    specifiers.push(builders.importSpecifier(builders.identifier('skip')));
  }

  var emberQUnitImport = builders.importDeclaration(
    specifiers,
    builders.literal('qunit')
  );

  ast.program.body.unshift(emberQUnitImport);
}


module.exports = function transform(source) {
  var sections = {
    addQUnitImport: true,
    modules: [],
    tests: [],
    skips: [],
    assertions: []
  };

  var ast = parseAst(source);

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

  if (sections.addQUnitImport) {
    addEmberQunitImport(ast, sections.skips.length > 0);
  }

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

  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
