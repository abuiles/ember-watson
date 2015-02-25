import Ember from 'ember';
import {module, test, skip} from 'qunit';
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

skip('Creating a new friends', function(assert) {
  visit('/friends/new');
  click('a[href=/friends/new]');
  andThen(function() {
    assert.equal(currentPath(), 'friends.new');
  });
  fillIn('input[placeholder=First Name]', 'Johnny');
  fillIn('input[placeholder=Last Name]', 'Foo');
  fillIn('input[placeholder=email]', 'j@cash.com');
  fillIn('input[placeholder=twitter]', 'jcash');
  click('input[value=Save]');
  andThen(function() {
    assert.equal(find('.error-message').text(), 'Friend was not saved', 'shows error');
  });

  assert.async(1);
  assert.deepEqual(1);
  assert.equal(1);
  assert.expect(1);
  assert.notDeepEqual(1);
  assert.notEqual(1);
  assert.notPropEqual(1);
  assert.notStrictEqual(1);
  assert.ok(1);
  assert.propEqual(1);
  assert.push(1);
  assert.strictEqual(1);
  assert.throws(1);
});

module('Acceptance: FooBar', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});
