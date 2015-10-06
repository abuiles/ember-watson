import Ember from 'ember';
import SomeBaseController from 'somewhere';

export default SomeBaseController.extend({
  fooController: Ember.inject.controller('foo')
});
