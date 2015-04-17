import DS from 'ember-data';

export default DS.Model.extend({
  comments: DS.belongsTo('post-comment', {async: true})
});

