Router.map(function() {
  this.route('foos', {
    resetNamespace: true
  }, function() {
    this.route('bars', {
      resetNamespace: true
    }, function() {
    });
  });
});
