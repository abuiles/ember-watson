import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('doorkeeper');

  this.route('protected', {path: '/'}, function(){
    this.resource('dashboard', Ember.K);
    this.resource('entry', { path: 'entries/:entry_id' });
    this.resource('employees', function() {
      this.resource('employee', { path: ':employee_id' });
      this.resource('new-employee', { path: 'new' });
    });
    this.resource('import', { path: 'employees/import' });
    this.route('sync-settings', {
      path: 'employees/sync-settings',
      resetNamespace: true
    });
    this.resource('devices', function(){
      this.resource('ipads');
      this.resource('printers');
    });
  });
});

export default Router;
