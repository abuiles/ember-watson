import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Route.extend({
  model: function() {
    //some stuff
  },

  setupController: function(controller, context) {
    //some extra stuffs
    this._super(controller, context);
  }
});
