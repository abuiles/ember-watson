import Em from 'ember';

export default Ember.Controller.extend({
  fooBarController: Em.inject.controller('foo/bar'),
  bazBarController: Em.inject.controller('baz/bar')
});
