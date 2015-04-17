import DS from 'ember-data';

export default DS.Model.extend({
  comments: DS.belongsTo(App.PostComment, {async: true})
});

