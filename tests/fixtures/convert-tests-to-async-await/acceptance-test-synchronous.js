import Ember from 'ember';
import { describe, it, beforeEach, afterEach } from 'mocha';

const { expect } = window.chai;

describe('basic acceptance test', function() {
  it('can visit subroutes', function() {
    expect(find('h2').text()).to.be.empty;
  });
});
