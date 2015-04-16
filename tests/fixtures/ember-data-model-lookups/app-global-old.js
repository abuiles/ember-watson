import DS from 'ember-data';

var Post = DS.Model.extend({
  postComments: DS.hasMany(App.PostComment, {async: true})
});

export default Post;
