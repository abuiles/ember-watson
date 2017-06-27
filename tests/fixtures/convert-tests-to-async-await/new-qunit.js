import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { currentURL, find, findAll, click, visit } from 'ember-native-dom-helpers';

moduleForAcceptance('Acceptance | helpers | selectChoose');

test('selectChoose helper opens the select and selects the option with the given text', async function(assert) {
  await visit('/helpers-testing');

  assert.equal(currentURL(), '/helpers-testing');
  selectChoose('.select-choose', 'three');
  assert.equal(find('.select-choose .ember-power-select-trigger').textContent.trim(), 'three', 'The proper value has been selected');
  assert.notOk(find('.ember-power-select-options'), 'The selectis closed');
  assert.equal(find('.select-choose-target').textContent.trim(), 'You\'ve selected: three');
});
