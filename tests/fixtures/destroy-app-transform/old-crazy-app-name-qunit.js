import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-cli-example-app-for-github/tests/helpers/start-app';

module('Acceptance | index', {
  beforeEach: function() {
    this.fooBarBazQux = startApp();
  },

  afterEach: function() {
    Ember.run(this.fooBarBazQux, 'destroy');
  }
});

test('visiting /index', function(assert) {
  visit('/index');

  andThen(function() {
    assert.equal(currentURL(), '/index');
  });
});
