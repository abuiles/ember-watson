function fn() {
  x.set('foo', 0);
  x.set('foo', 0).set('bar', 1).set('baz', 2);
  var y = x.set('foo', 0);
  for (;x.set('foo', 0);) {};
  return x.set('foo', 0);
}
