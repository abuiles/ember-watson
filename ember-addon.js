/* jshint node: true */
'use strict';

var commands  = require('./addon/commands');

module.exports = {
  name: 'ember-watson',
  includedCommands: function() {
    return commands;
  }
};
