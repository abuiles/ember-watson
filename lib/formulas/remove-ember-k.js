'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function removeEmberK(strategy) {
  var codemodDirName = path.dirname(require.resolve('ember-k-codemod'));
  var binPath = path.join(codemodDirName, 'bin', 'ember-k-codemod.js');
  var args = [];
  if (strategy) {
    args.push('--' + strategy);
  }
  spawn(binPath, args, {
    stdio: 'inherit',
    env: process.env
  });
};
