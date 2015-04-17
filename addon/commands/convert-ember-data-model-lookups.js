'use strict';

module.exports = {

  name: 'watson:convert-ember-data-model-lookups',
  description: 'convert ember data model lookups to use a dasherized string',
  works: 'insideProject',
  availableOptions: [
    {
      name: 'app-path',
      type: String,
      default: 'app'
    }
  ],

  run: function(commandOptions, rawArgs) {
    var Watson = require('../../index');
    var watson = new Watson();

    watson.transformEmberDataModelLookups(commandOptions.appPath);
  }

};
