import DS from 'ember-data';

const {hasMany} = DS;

var Post = DS.Model.extend({
  comments: DS.hasMany('post-comments', {async: true}),
  images: hasMany('images', {async: true}),
  pingbacks: DS.hasMany('pingbacks', {
    async: false
  }),
  links: hasMany('links', {
    async: false
  }),
  subposts:  DS.hasMany('posts', {
    polymorphic: true,
    async: false
  }),
  variables: hasMany('variables', {
    polymorphic: true,
    async: false
  }),
});

export default Post;
