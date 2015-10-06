'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var setupMock = require('./helpers/setup-cli-mock');
var commands = {
  'upgrade-qunit-tests': {
    method: 'transformQUnitTest',
    path: 'tests'
  },
  'convert-prototype-extensions': {
    method: 'transformPrototypeExtensions',
    path: 'app'
  },
  'convert-ember-data-model-lookups': {
    method: 'transformEmberDataModelLookups',
    path: 'app'
  },
  'convert-ember-data-async-false-relationships': {
    method: 'transformEmberDataAsyncFalseRelationships',
    path: 'app'
  },
  'methodify': {
    method: 'transformMethodify',
    path: 'app'
  },
  'convert-resource-router-mapping': {
    method: 'transformResourceRouterMapping',
    path: 'app/router.js'
  },
  'use-destroy-app-helper': {
    method: 'transformTestToUseDestroyApp',
    path: 'tests/acceptance'
  },
  'replace-needs-with-injection': {
    method: 'replaceNeedsWithInjection',
    path: 'app/controllers'
  }
};

var called;
var Mock = setupMock(commands, function (methodCalled) {
  called = methodCalled;
});

var cli = proxyquire('../lib/cli', {
  './watson': Mock
});

Object.keys(commands).forEach(function (commandName) {
  var command = commands[commandName];

  describe('CLI: ' + commandName, function() {
    beforeEach(function () {
      called = undefined;
    });

    it('default path', function() {
      cli(['node', 'ember-watson', commandName]);

      assert.deepEqual(called, command);
    });

    it('custom path', function() {
      cli(['node', 'ember-watson', commandName, 'my/path']);

      assert.deepEqual(called, {
        method: command.method,
        path: 'my/path'
      });
    });
  });
});
