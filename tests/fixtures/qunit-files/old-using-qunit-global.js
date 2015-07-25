var thing;

QUnit.module('foo-bar/helpers', {
  setup: function() {
    ok(true, 'setup worked');
  },
  teardown: function() {
    ok(true, 'teardown worked');
  }
});

QUnit.test('Can do helpery things', function() {
  function named() {
    equal('some', 'thing', 'testing equal in a callback');
  }

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

QUnit.skip('will be skipped', function() {
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
