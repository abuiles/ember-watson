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
  availableOptions: [
    { name: 'empty', type: Boolean, description: 'Replaces usages `Ember.K` with an empty function', default: false },
    { name: 'return-this', type: Boolean, description: 'Replaces usages `Ember.K` with a function that returns `this` to allow chaining', default: false }
  ],
  run: function() {
    watson.removeEmberK();
  }
};
