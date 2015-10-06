import Em from 'ember';

export default Ember.Controller.extend({
  needs: ['foo'],
  fooModel: Em.computed.alias('controllers.foo.model'),
  computedFoo: Em.computed('controllers.foo', function() {})
});
