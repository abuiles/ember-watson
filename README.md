## ember-watson  [![Build Status](https://travis-ci.org/abuiles/ember-watson.png?branch=master)](https://travis-ci.org/abuiles/ember-watson)

A young Ember Doctor. Currently I can only upgrade your QUnit test so
you don't have to do it manually.


## Using as an ember CLI addon

`ember-watson` can be used as an `ember CLI addon`, it will extend the
available list of commands.

To install, run `npm install ember-watson --save-dev` and you are good
to go.


### Commands

#### `ember upgrade-qunit-tests`

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
  - Use `beforeEach` and `afterEach` instead of `setup` and `teardown` inside module.

## Using without ember CLI

`ember-watson` can be used without `ember CLI` too, just do `npm
install -g ember-watson`

### Commands

#### `ember-watson upgrade-qunit-tests`

This command will transverse your tests directory fixing your QUnit
test to use the 2.0 compatible output.

## License

ember-watson is [MIT Licensed](https://github.com/abuiles/ember-watson/blob/master/LICENSE.md).
