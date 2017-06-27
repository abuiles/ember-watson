import Ember from 'ember';
import { describe, it, beforeEach, afterEach } from 'mocha';

const { expect } = window.chai;

describe('basic acceptance test', function() {
  it('can click save', async function() {
    await visit('/');

    let saveButton = find('button:contains("Save")');

    expect(find('h2').text()).to.be.empty;
    await fillIn('.field', 'value');

    expect(saveButton).to.be.enabled;
    await click(saveButton);
    expect(saveButton).to.be.disabled;
  });
});
