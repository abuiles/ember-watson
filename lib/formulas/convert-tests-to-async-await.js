/*jshint esversion: 6 */
const recast      = require('recast');
const builders    = recast.types.builders;
const types       = recast.types.namedTypes;
const parseAst    = require('../helpers/parse-ast');

// TODO await custom async helpers
const ASYNC_HELPERS = [
  'click',
  'fillIn',
  'visit',
  'keyEvent',
  'triggerEvent',
  'wait'
];

/**
 * it('test name', function() { ... })
 */
function isMochaTest(node) {
  return types.CallExpression.check(node.expression) &&
    node.expression.callee.name === 'it' &&
    node.expression.arguments.length === 2;
}

/**
 * test('test name', function(assert) { ... })
 */
function isQunitTest(node) {
  return types.CallExpression.check(node.expression) &&
    node.expression.callee.name === 'test' &&
    node.expression.arguments.length === 2;
}

/**
 * it.skip('test name', function() { ... })
 */
function isMochaSkip(node) {
  return types.CallExpression.check(node.expression) &&
    types.MemberExpression.check(node.expression.callee) &&
    node.expression.callee.object.name === 'it' &&
    node.expression.callee.property.name === 'skip' &&
    node.expression.arguments.length === 2;
}

function isTest(node) {
  return isMochaTest(node) || isMochaSkip(node) || isQunitTest(node);
}

/**
 * Only transform old-style async tests which use the `andThen` helper:
 *
 *   it('does something async', function() {
 *     visit('/route')
 *     andThen(function() {
 *       assert(...)
 *     })
 *   })
 */
function testUsesAndThen(node) {
  let callback = node.expression.arguments[1];
  return (types.FunctionExpression.check(callback) || types.ArrowFunctionExpression.check(callback)) &&
    types.BlockStatement.check(callback.body) &&
    callback.body.body.find(isAndThen);
}

/**
 * Whether the test uses mocha's `done` callback:
 *
 *   it('does something async', function(done) {
 *     visit('/route')
 *     andThen(function() {
 *       assert(...)
 *       done()
 *     })
 *   })
 */
function testUsesDone(node) {
  let callback = node.expression.arguments[1];
  return (types.FunctionExpression.check(callback) || types.ArrowFunctionExpression.check(callback)) &&
    callback.params.length > 0 &&
    callback.params[0].name === 'done';
}

/**
 * visit(...), fillIn(...), etc.
 */
function isAsyncHelper(node) {
  return types.CallExpression.check(node.expression) &&
    ASYNC_HELPERS.indexOf(node.expression.callee.name) !== -1;
}

/**
 * andThen(function() { ... })
 */
function isAndThen(node) {
  return types.CallExpression.check(node.expression) &&
    node.expression.callee.name === 'andThen' &&
    node.expression.arguments.length === 1 &&
    (types.FunctionExpression.check(node.expression.arguments[0]) ||
    types.ArrowFunctionExpression.check(node.expression.arguments[0]));
}

/**
 * done()
 */
function isDone(node) {
  // TODO: handle callback named something other than "done"
  return types.CallExpression.check(node.expression) &&
    node.expression.callee.name === 'done' &&
    node.expression.arguments.length === 0;
}

/**
 * For example, this usage of `done` is not safe to remove:
 *
 *   it('fetches contacts', function(done) {
 *     visit('/');
 *     server.get('/contacts', (db, request) => {
 *       done();
 *     });
 *   });
 */
function isDoneSafeToRemove(path) {
  for (let parent = path.parent; !isTest(parent.node); parent = parent.parent) {
    let node = parent.node;
    if (types.CallExpression.check(node.expression) && !isAndThen(node)) {
      return false;
    }
  }

  return true;
}

/**
 * andThen(() => assert(...));
 */
function isArrowAndThenExpression(path) {
  let expression = path.node.expression;
  return expression.callee.name === 'andThen' && expression.arguments[0].original.type === 'ArrowFunctionExpression';
}

/**
 * Replace `done` callback with async function
 *
 * Before:
 *   it('tests something', function(done) { ... })
 *
 * After:
 *   it('tests something', async function() { ... })
 */
function transformTestStatement(path, removeDone) {
  let callback = path.node.expression.arguments[1];
  callback.async = true;

  if (removeDone) {
    if (callback.params.length > 0 && types.Identifier.check(callback.params[0]) && callback.params[0].name === 'done') {
      callback.params.shift();
    }
  }
}

/**
 * Await async helpers
 *
 * Before:
 *   visit('/route')
 *
 * After:
 *   await visit('/route')
 */
function transformHelpers(path) {
  path.node.expression = builders.awaitExpression(path.node.expression);
}

/**
 * Remove andThen(...)
 *
 * Before:
 *   foo();
 *   andThen(function() {
 *     assert(...)
 *   })
 *   bar();
 *
 * After:
 *   foo();
 *   assert(...)
 *   bar();
 */
function transformAndThen(path) {
  // TODO: handle naming conflicts when merging scopes
  let outerStatements = path.parent.node.body;
  let idx = outerStatements.indexOf(path.node);
  if (idx !== -1) {
    let innerStatements = path.node.expression.arguments[0].body.body;
    if (!innerStatements && isArrowAndThenExpression(path)) {
      innerStatements = [outerStatements[1]];
      path.node.expression = path.node.expression.arguments[0].original.body;
    }
    outerStatements.splice(idx, 1, ...innerStatements);
  }
}

/**
 * Remove calls to done()
 *
 * Before:
 *   andThen(function() {
 *     assert(...)
 *     done();
 *   })
 *
 * After:
 *   andThen(function() {
 *     assert(...)
 *   })
 */
function transformDone(path) {
  let statements = path.parent.node.body;
  let idx = statements.indexOf(path.node);
  if (idx !== -1) {
      statements.splice(idx, 1);
  }
}

module.exports = function transform(source) {
  const ast = parseAst(source);

  const tests = [];
  let currentTest;

  recast.visit(ast, {
    visitExpressionStatement(path) {
      let node = path.node;

      if (isTest(node)) {
        if (!testUsesAndThen(node)) {
          // don't transform this test
          return false;
        }

        currentTest = {
          test: path,
          asyncHelpers: [],
          andThens: [],
          dones: [],
          removeDone: testUsesDone(path.node)
        };
        tests.push(currentTest);
      }

      if (currentTest) {
        if (isAsyncHelper(node)) {
          currentTest.asyncHelpers.push(path);
        }

        if (isAndThen(node)) {
          currentTest.andThens.push(path);
        }

        if (isDone(node)) {
          if (isDoneSafeToRemove(path)) {
            currentTest.dones.push(path);
          } else {
            currentTest.removeDone = false;
          }
        }
      }

      this.traverse(path);
    },
  });

  tests.forEach(function({ test, asyncHelpers, andThens, dones, removeDone }) {
    transformTestStatement(test, removeDone);

    asyncHelpers.forEach(function(path) {
      transformHelpers(path);
    });

    // process before `andThen` transform so the parent node still exists
    dones.forEach(function(path) {
      transformDone(path);
    });

    // process in reverse to handle nested `andThen`
    andThens.reverse().forEach(function(path) {
      transformAndThen(path);
    });
  });

  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
