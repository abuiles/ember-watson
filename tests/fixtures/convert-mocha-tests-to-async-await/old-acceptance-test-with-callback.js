import Ember from 'ember';
import { describe, it, beforeEach, afterEach } from 'mocha';

const { expect } = window.chai;

describe('basic acceptance test', function() {
  it('can visit subroutes', function(done) {
    visit('/');

    andThen(function() {
      expect(find('h2').text()).to.be.empty;
    });

    visit('/foo');

    andThen(function() {
      expect(find('h2').text()).to.be.equal('this is an acceptance test');
    });

    server.put('/contacts', (db, request) => {
      let params = JSON.parse(request.requestBody).contact;
      assert.deepEqual(params, {});
      done();
    });
  });
});
