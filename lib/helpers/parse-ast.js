var recast = require('recast');
var esprima = require('esprima');

module.exports = function(source) {
  return recast.parse(source, {
    esprima: esprima
  });
};
