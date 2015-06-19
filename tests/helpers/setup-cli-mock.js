'use strict';

var Mock = function Watson() {};

module.exports = function setup(commands, callback) {
  Object.keys(commands).forEach(function (commandName) {
    var command = commands[commandName];

    Mock.prototype[command.method] = function (path) {
      callback({
        method: command.method,
        path: path
      });
    };
  });

  return Mock;
};
