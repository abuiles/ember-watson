import DS from 'ember-data';

var Post = DS.Model.extend({
  postComments: DS.hasMany('post-comment', {async: true})
});

export default Post;
