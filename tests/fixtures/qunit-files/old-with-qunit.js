import Ember from 'ember';
import startApp from '../../helpers/start-app';
import Pretender from 'pretender';

var App;
var server;

module('Acceptance: FriendsNew', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

module('Acceptance: FooBar', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});
