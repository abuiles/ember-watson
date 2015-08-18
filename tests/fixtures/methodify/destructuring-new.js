import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Route.extend({
  model() {
    //some stuff
  },

  setupController(controller, context) {
    //some extra stuffs
    this._super(controller, context);
  }
});
