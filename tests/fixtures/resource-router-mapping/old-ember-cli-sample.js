import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('users', function() {
    this.route('edit', { path: ':user_id/edit' });
  });
  this.resource('dogs', function() {
    this.route('edit', { path: ':dog_id/edit' });
  });
});

export default Router;
