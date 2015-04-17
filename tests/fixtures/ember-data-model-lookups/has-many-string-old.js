import DS from 'ember-data';

var Post = DS.Model.extend({
  comments: DS.hasMany('post-comments', {async: true})
});

export default Post;
