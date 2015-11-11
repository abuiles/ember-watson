module('testing arrow functions', {
  setup: function(){
    console.log('starting');
  },
  teardown: function(){
    console.log('done');
  }
});

test('this function should have assert when translated', () => {
  ok(true);
});
