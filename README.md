## ember-watson  [![Build Status](https://travis-ci.org/abuiles/ember-watson.png?branch=master)](https://travis-ci.org/abuiles/ember-watson)

A young Ember Doctor.

## Using as an ember CLI addon

`ember-watson` can be used as an `ember CLI addon`, it will extend the
available list of commands.

To install, run `npm install ember-watson@latest --save-dev` and you are good
to go.


### Commands

#### `ember watson:upgrade-qunit-tests`

This command will traverse your tests directory fixing your QUnit
test to use the 2.0 compatible output (see
[ember-cli#3197](https://github.com/ember-cli/ember-cli/pull/3197)).

The following are some of the changes:

  - Add `import { module, test } from 'qunit'` if ember-qunit is not
    used. You need to use ember-cli-qunit-v0.3.8 which includes
    QUnit's shims. See [ember-cli#3245](https://github.com/ember-cli/ember-cli/pull/3245)
  -  Import `skip` if used in tests: `import { module,test, skip } from 'qunit'`
  - Add assert to callback function in `test`.
  - Use `assert` inside test, e.g. `ok` becomes `assert.ok`.
  - Use `beforeEach` and `afterEach` instead of `setup` and `teardown`
    inside module.

#### `ember watson:convert-prototype-extensions`

Convert computed properties and observers to not use prototype
extensions. You can specify `appPath` (defaults to `app/`) in case you
want to convert code somewhere different to `app/`.

For more info about this please refer to the following PR [Encourage decorator-style Ember.computed/Ember.observer](https://github.com/emberjs/guides/pull/110)

#### `ember watson:convert-ember-data-async-false-relationships`

In Ember Data 2.0 relationships will be asynchronous by default. Sync relationships will still be supported but you will need to manually opt into them by setting { async: false } on your relationships. This task adds an explicit `async: false` options to all `belongsTo` and `hasMany` that
either have no options or its options does not contain an explicit async value.

For more information, read [ember-data 1.13 release notes](http://emberjs.com/blog/2015/06/18/ember-data-1-13-released.html#toc_async-relationships)

#### `ember watson:convert-ember-data-model-lookups`

This changes the way model lookups happen when working with Ember
Data. When using `hasMany` or `belongsTo`, the first argument will
become a dasherized string. Here's some examples:

```javascript

// before, using a camelCase string

export default DS.Model.extend({
  postComments: DS.hasMany('postComment', {async: true})
});

// after

export default DS.Model.extend({
  postComments: DS.hasMany('post-comment', {async: true})
});

// before, using an variable or looking up on App.
export default DS.Model.extend({
  postComments: DS.hasMany(PostComment, {async: true})
});

// after

export default DS.Model.extend({
  postComments: DS.hasMany('post-comment', {async: true})
});
```

#### `ember watson:convert-resource-router-mapping <routerPath>`

Converts `this.resource('user')` to `this.route('user',
{resetNamespace: true })` in `app/router.js`.

Helps with the deprecation added added in
[ember.js/11517](https://github.com/emberjs/ember.js/pull/11517).

#### `ember watson:methodify <routerPath>`

Converts methods in file to ES6 method syntax.

#### `ember watson:find-overloaded-cps <path>`

Helps you locate all the places where your source may trigger the "Using the same function as getter and setter" deprecation.

#### `ember watson:use-destroy-app-helper <path>`

Convert (qunit or mocha flavored) acceptance tests to utilize the `destroyApp`
helper [introduced](https://github.com/ember-cli/ember-cli/pull/4772) in
Ember CLI 1.13.9.

#### `ember watson:replace-needs-with-injection <path>`

Convert `needs` declarations the individual properties using the new `Ember.inject.controller()` feature. Also convert any uses of the `controllers` hash to use the newly defined properties.

### Specifying a file or path.

You can run any of the commands passing as argument the path, file or
regular expression of the files that you want to transform.

```
ember watson:upgrade-qunit-tests tests/unit*
ember watson:upgrade-qunit-tests tests/unit/model-test.js
ember watson:upgrade-qunit-tests tests
```

The same is possible with `ember watson:convert-prototype-extensions` and `ember watson:convert-ember-data-model-lookups`.

## Using without ember CLI

`ember-watson` can be used without `ember CLI` too, just do `npm
install -g ember-watson`

### Commands

#### `ember-watson upgrade-qunit-tests`

This command will transverse your tests directory fixing your QUnit
test to use the 2.0 compatible output.

#### `ember-watson convert-prototype-extensions`

## License

ember-watson is [MIT Licensed](https://github.com/abuiles/ember-watson/blob/master/LICENSE.md).
