var thing;

import {module, test, skip} from 'qunit';

QUnit.module('foo-bar/helpers', {
  beforeEach: function(assert) {
    assert.ok(true, 'setup worked');
  },
  afterEach: function(assert) {
    assert.ok(true, 'teardown worked');
  }
});

QUnit.test('Can do helpery things', function(assert) {
  function named() {
    assert.equal('some', 'thing', 'testing equal in a callback');
  }

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

QUnit.skip('will be skipped', function(assert) {
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
