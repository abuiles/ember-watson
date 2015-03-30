import Ember from 'ember';

export default Ember.Controller.extend({
  hasNoDependency: Ember.computed(function() {
    return true;
  }),

  hasMultipleDependencies: Ember.computed('foo', 'bar', function() {
    return this.getProperties('foo', 'bar');
  }),

  chainedCP: Ember.computed('foo', function() {
    return false;
  }).volatile().readOnly(),

  isNotExtendingPrototype: Ember.computed(function() {
    return true;
  }),

  isNotExtendingPrototypeWithDependencies: Ember.computed('foo', function() {
    return this.get('foo');
  }),

  simpleObserver: Ember.observer('foo', function() {
    this.set('bar', true);
  }),

  chainedObserver: Ember.observer('foo', 'bar', function(property) {
    this.set('baz', true);
  }).on('init'),

  funkyProperty: Ember.computed(...KEYS, function() {

  })
});
