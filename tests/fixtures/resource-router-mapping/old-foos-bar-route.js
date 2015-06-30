Router.map(function() {
  this.resource('foos', function() {
    this.resource('bars', function() {
    });
  });
});
