import Ember from 'ember';
import {module, test} from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Pretender from 'pretender';

var App;
var server;

module('Acceptance: FriendsNew', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

module('Acceptance: FooBar', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});
