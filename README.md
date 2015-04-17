## ember-watson  [![Build Status](https://travis-ci.org/abuiles/ember-watson.png?branch=master)](https://travis-ci.org/abuiles/ember-watson)

A young Ember Doctor.

## Using as an ember CLI addon

`ember-watson` can be used as an `ember CLI addon`, it will extend the
available list of commands.

To install, run `npm install ember-watson@latest --save-dev` and you are good
to go.


### Commands

#### `ember watson:upgrade-qunit-tests`

This command will transverse your tests directory fixing your QUnit
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

#### `ember watson:convert-ember-data-model-lookups`

This changes the way model lookups happen when working with Ember
Data. When using `hasMany` or `belongsTo`, the first argument will
become a camelized string. Here's some examples:

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
