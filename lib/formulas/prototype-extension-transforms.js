var recast           = require('recast');
var builders         = recast.types.builders;
var types            = recast.types.namedTypes;
var addDefaultImport = require('./helpers/add-default-import');
var isImportFor      = require('./helpers/is-import-for');
var parseAst         = require('../helpers/parse-ast');

function hasPrototypeExtensions(sections) {
  return sections.observers.length > 0 ||
    sections.computedProperties.length > 0 ||
    sections.eventObservers.length > 0;
}

function transformExtension(path, type) {
  var node = path.node;
  var callback = node.callee.object;
  var dependencies = node.arguments.slice();

  var args = dependencies;
  args.push(callback);

  var wrappedCallback = builders.callExpression(builders.identifier(type), args);

  path.replace(wrappedCallback);
}

function transformComputedProperty(path) {
  transformExtension(path, 'Ember.computed');
}

function transformObserver(path) {
  transformExtension(path, 'Ember.observer');
}

function transformEventObserver(path) {
  transformExtension(path, 'Ember.on');
}

function isPrototypeExtension(node, name){
  return types.MemberExpression.check(node.callee) &&
    types.Identifier.check(node.callee.property) &&
    node.callee.property.name === name &&
    types.FunctionExpression.check(node.callee.object);
}

function isComputedProperty(node) {
  return isPrototypeExtension(node, 'property');
}

function isObserver(node) {
  return isPrototypeExtension(node, 'observes');
}

function calledFromFunctionExpression(node) {
  if (types.FunctionExpression.check(node)) {
    return true;
  }
  if (types.CallExpression.check(node)) {
    return calledFromFunctionExpression(node.callee);
  }
  if (types.MemberExpression.check(node)) {
    return calledFromFunctionExpression(node.object);
  }
  return false;
}

function isEventObserver(node) {
  return types.MemberExpression.check(node.callee) &&
    types.Identifier.check(node.callee.property) &&
    node.callee.property.name === 'on' &&
    calledFromFunctionExpression(node);
}

module.exports = function transform(source) {
  var sections = {
    computedProperties: [],
    observers: [],
    eventObservers: [],
    addEmberImport: true
  };

  var ast = parseAst(source);

  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.node;

      if (isObserver(node)) {
        sections.observers.push(path);
      }

      if (isComputedProperty(node)) {
        sections.computedProperties.push(path);
      }

      if (isEventObserver(node)) {
        sections.eventObservers.push(path);
      }

      this.traverse(path);
    },
    visitImportDeclaration: function(path) {
      if (isImportFor('ember', path.node)) {
        sections.addEmberImport = false;
      }

      this.traverse(path);
    }
  });

  sections.observers.forEach(transformObserver);
  sections.computedProperties.forEach(transformComputedProperty);
  sections.eventObservers.forEach(transformEventObserver);

  if (hasPrototypeExtensions(sections) && sections.addEmberImport) {
    addDefaultImport(ast, 'ember', 'Ember');
  }
  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
