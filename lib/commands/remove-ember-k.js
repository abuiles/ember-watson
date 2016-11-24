'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:remove-ember-k',
  description: 'Removes all usages of Ember.K',
  works: 'insideProject',
  anonymousOptions: [
    '<path>'
  ],
  run: function() {
    watson.removeEmberK();
  }
};
