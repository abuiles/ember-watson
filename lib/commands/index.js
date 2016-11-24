'use strict';

module.exports = {
  'watson:all': require('./all'),
  'watson:upgrade-qunit-tests': require('./upgrade-qunit-tests'),
  'watson:convert-prototype-extensions': require('./convert-prototype-extensions'),
  'watson:convert-ember-data-model-lookups': require('./convert-ember-data-model-lookups'),
  'watson:convert-ember-data-async-false-relationships': require('./convert-ember-data-async-false-relationships'),
  'watson:methodify': require('./methodify'),
  'watson:convert-resource-router-mapping': require('./convert-resource-router-mapping'),
  'watson:find-overloaded-cps': require('./find-overloaded-cps'),
  'watson:use-destroy-app-helper': require('./use-destroy-app-helper'),
  'watson:remove-ember-k': require('./remove-ember-k'),
  'watson:replace-needs-with-injection': require('./replace-needs-with-injection'),
  'watson:remove-ember-data-is-new-serializer-api': require('./remove-ember-data-is-new-serializer-api')
};
