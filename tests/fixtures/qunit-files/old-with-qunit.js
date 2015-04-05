import Ember from 'ember';
import startApp from '../../helpers/start-app';
import Pretender from 'pretender';

var App;
var server;

module('Acceptance: FriendsNew', {
  setup: function() {
    App = startApp();
    ok(true, 'app started');
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Creating a new friends', function() {
  visit('/friends/new');
  click('a[href=/friends/new]');
  andThen(function() {
    equal(currentPath(), 'friends.new');
  });
  fillIn('input[placeholder=First Name]', 'Johnny');
  fillIn('input[placeholder=Last Name]', 'Foo');
  fillIn('input[placeholder=email]', 'j@cash.com');
  fillIn('input[placeholder=twitter]', 'jcash');
  click('input[value=Save]');
  andThen(function() {
    equal(find('.error-message').text(), 'Friend was not saved', 'shows error');
  });

  async(1);
  deepEqual(1);
  equal(1);
  expect(1);
  notDeepEqual(1);
  notEqual(1);
  notPropEqual(1);
  notStrictEqual(1);
  ok(1);
  propEqual(1);
  push(1);
  strictEqual(1);
  throws(1);
});

module('Acceptance: FooBar', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});
