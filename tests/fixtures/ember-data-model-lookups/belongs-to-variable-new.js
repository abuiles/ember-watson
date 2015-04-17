import DS from 'ember-data';
import PostComment from 'my-app/models/post-comment';

export default DS.Model.extend({
  comments: DS.belongsTo('post-comment', {async: true})
});
