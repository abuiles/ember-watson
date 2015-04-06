# ember-watson Changelog

### 0.3.0

This release include  some improvements to existing transformations
and namespace all the commands.

Before you would call the commands like:

```
ember upgrade-qunit-tests
ember convert-prototype-extensions
```

Now they are namespaced under `watson:`

```
ember watson:upgrade-qunit-tests
ember watson:convert-prototype-extensions
```

#### QUnit transforms

Adds support to yield assert into the
beforeEach/afterEach callbacks [#7](https://github.com/abuiles/ember-watson/pull/7)

The following

```
module('Acceptance: FriendsNew', {
  setup: function() {
    App = startApp();
    ok(true, 'app started');
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});
```

Will be replaced with:

```
module('Acceptance: FriendsNew', {
  beforeEach: function(assert) {
    App = startApp();
    assert.ok(true, 'app started');
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});
```

#### Prototype Extensions

Extends the transformations to include `.on` event observers, the
following

```
chainedObserver: function(property) {
  this.set('baz', true);
}.observes('foo', 'bar').on('init'),

onInit: function() {
  this.set('foobar', true);
}.on('init')
```

Is replaced with:

```
chainedObserver: Ember.on('init', Ember.observer('foo', 'bar', function(property) {
  this.set('baz', true);
})),

onInit: Ember.on('init', function() {
  this.set('foobar', true);
})
```

Also if `Ember` is not imported, the import will be added for you:

```
import Ember from 'ember'
```
