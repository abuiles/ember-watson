/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';

describe('Acceptance: Index', function() {
  var application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    Ember.run(application, 'destroy');
  });

  it('can visit /index', function() {
    visit('/index');

    andThen(function() {
      Ember.run(this, function() {
        // something
      });
      expect(currentPath()).to.equal('index');
    });
  });
});
