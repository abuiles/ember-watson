import {module, test} from 'qunit';
module('testing arrow functions', {
  beforeEach: function(){
    console.log('starting');
  },
  afterEach: function(){
    console.log('done');
  }
});

test('this function should have assert when translated', assert => {
  assert.ok(true);
});
