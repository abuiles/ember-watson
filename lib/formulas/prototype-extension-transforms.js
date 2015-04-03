var recast   = require('recast');
var builders = recast.types.builders;

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

function transformEventObservers(path) {
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

function isObservable(node) {
  return isPrototypeExtension(node, 'on');
}

module.exports = function transform(source) {
  var sections = {
    computedProperties: [],
    observers: [],
    eventObservers: []
  };

  var ast = recast.parse(source);

  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.node;

      if (isObservable(node)) {
        sections.eventObservers.push(path);
      }

      if (isComputedProperty(node)) {
        sections.computedProperties.push(path);
      }

      if (isObserver(node)) {
        sections.observers.push(path);
      }

      this.traverse(path);
    }
  });

  sections.computedProperties.forEach(transformComputedProperty);

  sections.observers.forEach(transformObserver);

  sections.eventObservers.forEach(transformEventObservers);

  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
