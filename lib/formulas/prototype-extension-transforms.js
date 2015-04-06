var recast           = require('recast');
var builders         = recast.types.builders;
var addDefaultImport = require('./helpers/add-default-import');
var isImportFor      = require('./helpers/is-import-for');



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
  return node.callee.type === 'MemberExpression' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === name &&
    node.callee.object.type === 'FunctionExpression';
}

function isComputedProperty(node) {
  return isPrototypeExtension(node, 'property');
}

function isObserver(node) {
  return isPrototypeExtension(node, 'observes');
}

function isEventObserver(node) {
  return node.callee.type === 'MemberExpression' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'on' &&
    (node.callee.object.type === 'FunctionExpression' || node.callee.object.type === 'CallExpression');
}

module.exports = function transform(source) {
  var sections = {
    computedProperties: [],
    observers: [],
    eventObservers: [],
    addEmberImport: true
  };

  var ast = recast.parse(source);

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

  if (sections.addEmberImport) {
    addDefaultImport(ast, 'ember', 'Ember');
  }
  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
