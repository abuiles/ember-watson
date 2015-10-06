import Em from 'ember';

export default Ember.Controller.extend({
  needs: [
    'foo/bar',
    'baz/bar'
  ]
});
