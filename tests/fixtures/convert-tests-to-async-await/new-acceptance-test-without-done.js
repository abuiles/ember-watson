import Ember from 'ember';
import { describe, it, beforeEach, afterEach } from 'mocha';

const { expect } = window.chai;

describe('basic acceptance test', function() {
  it('can visit subroutes', async function() {
    await visit('/');

    expect(find('h2').text()).to.be.empty;

    await visit('/foo');

    expect(find('h2').text()).to.be.equal('this is an acceptance test');
  });
});
