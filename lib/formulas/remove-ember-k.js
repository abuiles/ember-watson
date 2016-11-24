'use strict';

var spawn = require('child_process').spawn;
var path = require("path");

module.exports = function removeEmberK() {
  var binPath = path.dirname(require.resolve("ember-k-codemod")) + "/bin/ember-k-codemod.js";
  spawn(binPath, [], {
    stdio: "inherit",
    env: process.env
  });
};
