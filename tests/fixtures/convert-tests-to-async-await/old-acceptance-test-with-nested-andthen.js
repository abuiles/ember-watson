import Ember from 'ember';
import { describe, it, beforeEach, afterEach } from 'mocha';

const { expect } = window.chai;

describe('basic acceptance test', function() {
  it('can click save', function(done) {
    visit('/');

    andThen(function() {
      let saveButton = find('button:contains("Save")');

      expect(find('h2').text()).to.be.empty;
      fillIn('.field', 'value');

      andThen(function() {
        expect(saveButton).to.be.enabled;
        click(saveButton);
      });

      andThen(function() {
        expect(saveButton).to.be.disabled;
        done();
      });
    });
  });
});
