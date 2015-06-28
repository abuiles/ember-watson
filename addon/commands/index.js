'use strict';

module.exports = {
  'watson:upgrade-qunit-tests': require('./upgrade-qunit-tests'),
  'watson:convert-prototype-extensions': require('./convert-prototype-extensions'),
  'watson:convert-ember-data-model-lookups': require('./convert-ember-data-model-lookups'),
  'watson:convert-ember-data-async-false-relationships': require('./convert-ember-data-async-false-relationships'),
  'watson:convert-resource-router-mapping': require('./convert-resource-router-mapping')
};
