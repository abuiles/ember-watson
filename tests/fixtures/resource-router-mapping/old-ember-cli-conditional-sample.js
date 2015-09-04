import Ember from 'ember';
import config from './config/environment';

let AdminUser = true;

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.resource('items', function () {
    this.resource('item_details', {
      path: '/:item_id'
    }, function () {
      if (AdminUser) {
        this.route('create_subitem', {
          path: '/new_sub_item'
        });
      }
    });
  });
});

export default Router;
