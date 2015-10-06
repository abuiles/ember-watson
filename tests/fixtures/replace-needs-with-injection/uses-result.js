import Em from 'ember';

export default Ember.Controller.extend({
  fooController: Em.inject.controller('foo'),
  fooModel: Em.computed.alias('fooController.model'),
  computedFoo: Em.computed('fooController', function() {})
});
