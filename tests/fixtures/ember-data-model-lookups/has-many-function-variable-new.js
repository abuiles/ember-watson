import DS from 'ember-data';

var hasMany = DS.hasMany;

export default DS.Model.extend({
  comments: hasMany('post-comment', {async: true})
});

