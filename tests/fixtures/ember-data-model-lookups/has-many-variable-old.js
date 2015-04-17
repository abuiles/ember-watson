import DS from 'ember-data';
import Post from 'my-app/models/post';

export default DS.Model.extend({
  messages: DS.hasMany(Post, {async: true})
});
