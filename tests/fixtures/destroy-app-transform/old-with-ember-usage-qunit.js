import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-cli-example-app-for-github/tests/helpers/start-app';

module('Acceptance | index', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /index', function(assert) {
  visit('/index');

  andThen(function() {
    Ember.run(this, function() {
      // something
    });
    assert.equal(currentURL(), '/index');
  });
});
