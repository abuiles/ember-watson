var recast = require('recast');
var babel = require('babel-core');

module.exports = function(source) {
  return recast.parse(source, {
    esprima: babel
  });
};
