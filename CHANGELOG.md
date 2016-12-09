# ember-watson Changelog

### 0.8.5

- Fixes property forward flags to remove-ember-k command. [https://github.com/abuiles/ember-watson/pull/106](https://github.com/abuiles/ember-watson/pull/106).


### 0.8.4

- Add `remove-ember-k` which replaces all usages of `Ember.K` with just plain functions [cibernox](https://github.com/abuiles/ember-watson/pull/105).


### 0.8.2

- Fix `remove-ember-data-is-new-serializer-api` so it can be run inside ember-cli.

### 0.8.1

- Add remove-ember-data-is-new-serializer-api command [#96](https://github.com/abuiles/ember-watson/pull/96) [fivetanley](https://github.com/fivetanley).

### 0.7.0

- Add `ember watson:replace-needs-with-injection <path>` which replaces `needs` with `injection`. For more info check [#87](https://github.com/abuiles/ember-watson/pull/87))

### 0.6.6

- Add `ember watson:use-destroy-app-helper` which helps you migrate
  acceptance tests to use destroy-app helper (for more info check
  [#84](https://github.com/abuiles/ember-watson/pull/84))

### 0.6.5

- Make convert-resource-router-mapping transform not break when there is if expressions inside the router definition
(see [#80](https://github.com/abuiles/ember-watson/pull/80)).

### 0.6.4

- Add `ember watson:find-overloaded-cps` command to help locating all
the places where your source may trigger the "Using the same function
as getter and setter" deprecation. This command is purely advisory, it
outputs a colored report showing the snippets of code that are
probably deprecated CPs.

### 0.6.3

- Use babel as AST parser (see [#77](https://github.com/abuiles/ember-watson/pull/77)).
- Update recast and use esprima as AST parser (see [#74](https://github.com/abuiles/ember-watson/pull/74)).

### 0.6.2

- Improve error logging when file skipped (see [#71](https://github.com/abuiles/ember-watson/pull/71)).
- Fix typo in README.

### 0.6.1

- Fix `watson:methodify` command to ensure app path gets defaulted correctly.

### 0.6.0

- Updates QUnit transformation to work with QUnit.test style.
- Remove commands from broccoli trees.
- Adds command `methodify` which convert methods to new ES6 syntax.


### 0.5.9

Improves `ember watson:convert-ember-data-model-lookups` do it doesn't
transform member expressions passed as first parameter to store (see issue [#35](https://github.com/abuiles/ember-watson/issues/35)).

### 0.5.8

Extend `convert-resource-router-mapping` to transform `this.resources`
defined inside `this.route`.

### 0.5.7

Fixes addon command `convert-resource-router-mapping`.

### 0.5.6

Adds `convert-resource-router-mapping` which convert the deprecated
`this.resource('user')` to `this.route('user', {resetNamespace: true
})`. See [#50](https://github.com/abuiles/ember-watson/issues/50) for
more info.

### 0.5.5

Fixes issue [#47](https://github.com/abuiles/ember-watson/issues/47).

### 0.5.4

Add tests and fixes issue [#31](https://github.com/abuiles/ember-watson/issues/31).

### 0.5.3

Fixed issue in bin command where path was not being passed.

### 0.5.2

Fixed typo in bin command.

### 0.5.1

This release includes a new command to help you add an explicit
`async: false` options to all `belongsTo` and `hasMany` that either
have no options or its options does not contain an explicit async
value.

```
ember watson:convert-ember-data-async-false-relationships
````

By default relationships will be async in Ember-Data, see issue
[#3220](https://github.com/emberjs/data/issues/3220) for more info.


### 0.5.0

This release allows commands to take single files, additionally it
modifies the way in which the path is specified.

You can run any of the commands passing as argument the path, file or regular expression of the files that you want to transform.

```
ember watson:upgrade-qunit-tests tests/unit*
ember watson:upgrade-qunit-tests tests/unit/model-test.js
ember watson:upgrade-qunit-tests tests
```

The same is possible with `ember watson:convert-prototype-extensions` and `ember watson:convert-ember-data-model-lookups`.


### 0.4.2

Improves command `ember watson:convert-ember-data-model-lookups`
adding the ability to change store methods like findAll, find,
findQuery, all, etc to use the string form.

See the transformations on the file
[route-old.js](https://github.com/abuiles/ember-watson/blob/4e1ec53e73f2cf017a21d493519b77f7f025660f/tests/fixtures/ember-data-model-lookups/route-old.js)
on [route-new.js](https://github.com/abuiles/ember-watson/blob/4e1ec53e73f2cf017a21d493519b77f7f025660f/tests/fixtures/ember-data-model-lookups/route-new.js).

### 0.4.0

This version includes a new command which normalizes how you reference
models in `belongsTo` and `hasMany` relationships to their dasherized
from. Looking up via camelCase, variable, or App.Post will be removed
for Ember Data 1.0,

Running `ember watson:convert-ember-data-model-lookups` will transform
models looking like the following:

```
export default DS.Model.extend({
  postComments: DS.hasMany('postComment', {async: true})
});

```

To:

```
export default DS.Model.extend({
  postComments: DS.hasMany('post-comment', {async: true})
});
```

Big thanks to [Stanley Stuart](https://github.com/fivetanley) for his
work on this command.

### 0.3.1

A bug was introduced in `0.3.0` causing `import Ember from 'ember'` to
be included in any JavaScript file independently if prototype
extensions were used or not. This release fixes the issue so the
import declaration is only included if prototype extensions are
detected.

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
