import Ember from 'ember';

export default Ember.Controller.extend({
  hasNoDependency: function() {
    return true;
  }.property(),

  hasMultipleDependencies: function() {
    return this.getProperties('foo', 'bar');
  }.property('foo', 'bar'),

  chainedCP: function() {
    return false;
  }.property('foo').volatile().readOnly(),

  isNotExtendingPrototype: Ember.computed(function() {
    return true;
  }),

  isNotExtendingPrototypeWithDependencies: Ember.computed('foo', function() {
    return this.get('foo');
  }),

  simpleObserver: function() {
    this.set('bar', true);
  }.observes('foo'),

  chainedObserver: function(property) {
    this.set('baz', true);
  }.observes('foo', 'bar').on('init'),

  onInit: function() {
    this.set('foobar', true);
  }.on('init'),

  similarMethods: function() {
    $(document).on('click', function() {
      console.log('someone clicked');
    });
    users.map(property('name'));
    user.observes('name', function() {
      console.log('Name changed');
    });
  }.observes('name').on('init')
});
