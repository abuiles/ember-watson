'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');

var transformEmberDataModelLookupsCalledWith;
var transformEmberDataAsyncFalseRelationshipsCalledWith;
var transformPrototypeExtensionsCalledWith;
var transformQUnitTestCalledWith;
var transformResourceRouterMappingCalledWith;
var transformMethodifyCalledWith;
var transformTestToUseDestroyAppCalledWith;

proxyquire('../lib/commands/convert-ember-data-model-lookups', {
  '../../index': Mock
});

proxyquire('../lib/commands/convert-ember-data-async-false-relationships', {
  '../../index': Mock
});

proxyquire('../lib/commands/convert-prototype-extensions', {
  '../../index': Mock
});

proxyquire('../lib/commands/upgrade-qunit-tests', {
  '../../index': Mock
});

proxyquire('../lib/commands/convert-resource-router-mapping', {
  '../../index': Mock
});

proxyquire('../lib/commands/methodify', {
  '../../index': Mock
});

proxyquire('../lib/commands/use-destroy-app-helper', {
  '../../index': Mock
});

function Mock() {}

Mock.prototype.transformEmberDataModelLookups = function() {
  transformEmberDataModelLookupsCalledWith = Array.prototype.slice.apply(arguments);
};

Mock.prototype.transformEmberDataAsyncFalseRelationships = function () {
  transformEmberDataAsyncFalseRelationshipsCalledWith = Array.prototype.slice.apply(arguments);
};

Mock.prototype.transformPrototypeExtensions = function () {
  transformPrototypeExtensionsCalledWith = Array.prototype.slice.apply(arguments);
};

Mock.prototype.transformQUnitTest = function () {
  transformQUnitTestCalledWith = Array.prototype.slice.apply(arguments);
};

Mock.prototype.transformResourceRouterMapping = function () {
  transformResourceRouterMappingCalledWith = Array.prototype.slice.apply(arguments);
};

Mock.prototype.transformMethodify = function () {
  transformMethodifyCalledWith = Array.prototype.slice.apply(arguments);
};

Mock.prototype.transformTestToUseDestroyApp = function() {
  transformTestToUseDestroyAppCalledWith = Array.prototype.slice.apply(arguments);
};

describe('Commands:', function () {

  afterEach(function () {
    transformEmberDataModelLookupsCalledWith = null;
    transformEmberDataAsyncFalseRelationshipsCalledWith = null;
    transformPrototypeExtensionsCalledWith = null;
    transformQUnitTestCalledWith = null;
    transformResourceRouterMappingCalledWith = null;
    transformMethodifyCalledWith = null;
    transformTestToUseDestroyAppCalledWith = null;
  });

  it('convert-ember-data-model-lookups calls the correct transform', function () {
    var Command = require('../lib/commands/convert-ember-data-model-lookups');

    Command.run({}, []);
    assert.deepEqual(transformEmberDataModelLookupsCalledWith, ['app']);

    Command.run({}, ['some-app']);
    assert.deepEqual(transformEmberDataModelLookupsCalledWith, ['some-app']);
  });

  it('convert-ember-data-async-false-relationships calls the correct transform', function () {
    var Command = require('../lib/commands/convert-ember-data-async-false-relationships');

    Command.run({}, []);
    assert.deepEqual(transformEmberDataAsyncFalseRelationshipsCalledWith, ['app']);

    Command.run({}, ['some-app']);
    assert.deepEqual(transformEmberDataAsyncFalseRelationshipsCalledWith, ['some-app']);
  });

  it('convert-prototype-extensions calls the correct transform', function () {
    var Command = require('../lib/commands/convert-prototype-extensions');

    Command.run({}, []);
    assert.deepEqual(transformPrototypeExtensionsCalledWith, ['app']);

    Command.run({}, ['some-app']);
    assert.deepEqual(transformPrototypeExtensionsCalledWith, ['some-app']);
  });

  it('upgrade-qunit-tests calls the correct transform', function () {
    var Command = require('../lib/commands/upgrade-qunit-tests');

    Command.run({}, []);
    assert.deepEqual(transformQUnitTestCalledWith , ['tests']);

    Command.run({}, ['other-dir']);
    assert.deepEqual(transformQUnitTestCalledWith , ['other-dir']);
  });

  it('convert-resource-router-mapping calls the correct transform', function() {
    var Command = require('../lib/commands/convert-resource-router-mapping');

    Command.run({}, []);
    assert.deepEqual(
      transformResourceRouterMappingCalledWith,
      ['app/router.js']
    );

    Command.run({}, ['other-router']);
    assert.deepEqual(
      transformResourceRouterMappingCalledWith,
      ['other-router']
    );
  });

  it('methodify calls the correct transform', function () {
    var Command = require('../lib/commands/methodify');

    Command.run({}, []);
    assert.deepEqual(transformMethodifyCalledWith, ['app']);

    Command.run({}, ['some-app']);
    assert.deepEqual(transformMethodifyCalledWith, ['some-app']);
  });

  it('methodify calls the correct transform', function () {
    var Command = require('../lib/commands/use-destroy-app-helper');

    Command.run({}, []);
    assert.deepEqual(transformTestToUseDestroyAppCalledWith, ['tests/acceptance']);

    Command.run({}, ['tests/my-crazy-other-thing']);
    assert.deepEqual(transformTestToUseDestroyAppCalledWith, ['tests/my-crazy-other-thing']);
  });
});
