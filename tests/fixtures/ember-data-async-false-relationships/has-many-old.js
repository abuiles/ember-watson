import DS from 'ember-data';

const {hasMany} = DS;

var Post = DS.Model.extend({
  comments: DS.hasMany('post-comments', {async: true}),
  images: hasMany('images', {async: true}),
  pingbacks: DS.hasMany('pingbacks'),
  links: hasMany('links'),
  subposts:  DS.hasMany('posts', {polymorphic: true}),
  variables: hasMany('variables', {polymorphic: true}),
});

export default Post;
