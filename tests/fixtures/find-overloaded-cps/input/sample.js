/* jshint esnext: true */

import Ember from 'ember';
var Em = Ember;
var computed = Ember.computed;

Ember.Component.extend({
  first: Ember.computed(function(k, v) {}),
  second: Em.computed('first', function(k, v) { }),
  third: computed('second', function(k, v) { }),
  fourth: function(k, v) { }.property('third'),


  firstLegal: Ember.computed(function() {}),
  secondLegal: Em.computed('first', function() { }),
  thirdLegal: computed('second', function() { }),
  fourthLegal: function() { }.property('third')


});
