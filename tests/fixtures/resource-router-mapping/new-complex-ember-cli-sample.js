import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('doorkeeper');

  this.route('protected', {path: '/'}, function(){
    this.route('dashboard', {
      resetNamespace: true
    }, Ember.K);
    this.route('entry', {
      path: 'entries/:entry_id',
      resetNamespace: true
    });
    this.route('employees', {
      resetNamespace: true
    }, function() {
      this.route('employee', {
        path: ':employee_id',
        resetNamespace: true
      });
      this.route('new-employee', {
        path: 'new',
        resetNamespace: true
      });
    });
    this.route('import', {
      path: 'employees/import',
      resetNamespace: true
    });
    this.route('sync-settings', {
      path: 'employees/sync-settings',
      resetNamespace: true
    });
    this.route('devices', {
      resetNamespace: true
    }, function(){
      this.route('ipads', {
        resetNamespace: true
      });
      this.route('printers', {
        resetNamespace: true
      });
    });
  });
});

export default Router;
