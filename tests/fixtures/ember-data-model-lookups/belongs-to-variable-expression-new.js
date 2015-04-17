import DS from 'ember-data';

var belongsTo = DS.belongsTo;

export default DS.Model.extend({
  comments: belongsTo('post-comment', {async: true})
});

