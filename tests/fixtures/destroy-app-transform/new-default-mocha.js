import destroyApp from '../helpers/destroy-app';
/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';

describe('Acceptance: Index', function() {
  var application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    destroyApp(application);
  });

  it('can visit /index', function() {
    visit('/index');

    andThen(function() {
      expect(currentPath()).to.equal('index');
    });
  });
});
