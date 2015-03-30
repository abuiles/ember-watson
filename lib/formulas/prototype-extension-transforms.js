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

module.exports = function transform(source) {
  var sections = {
    computedProperties: [],
    observers: []
  };

  var ast = recast.parse(source);

  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.node;

      if (isComputedProperty(node)) {
        sections.computedProperties.push(path);
      }

      if (isObserver(node)) {
        sections.observers.push(path);
      }

      this.traverse(path);
    }
  });

  sections.computedProperties.forEach(function(cp) {
    transformComputedProperty(cp);
  });

  sections.observers.forEach(function(observer) {
    transformObserver(observer);
  });

  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};
