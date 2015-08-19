function fn() {
  x.set('foo', 0)
   .set('bar', 1)
   .set('baz', 2);

  x.set('foo', {
    a: 0
  }).set('bar', 1);
}
