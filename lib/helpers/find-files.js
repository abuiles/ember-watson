var path      = require('path');
var walkSync  = require('walk-sync');
var fs        = require('fs');

module.exports = function(rootPath, ext) {
  var files = [];

  if (path.extname(rootPath).length > 0) {
    files.push(rootPath);
  } else if (fs.existsSync(rootPath)) {
    files = walkSync(rootPath).filter(function(file) {
      return path.extname(file) === ext;
    }).map(function(file) {
      return path.join(rootPath, file);
    });
  }

  return files;
};
