/* jshint node: true */
'use strict';

var commands  = require('./lib/commands');

module.exports = {
  name: 'ember-watson',
  includedCommands: function() {
    return commands;
  }
};
