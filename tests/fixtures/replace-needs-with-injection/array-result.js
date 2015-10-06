import Em from 'ember';

export default Ember.Controller.extend({
  barController: Em.inject.controller('bar'),
  fooController: Em.inject.controller('foo')
});
