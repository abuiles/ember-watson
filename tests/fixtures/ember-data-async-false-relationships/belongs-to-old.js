import DS from 'ember-data';

const {belongsTo} = DS;

var Post = DS.Model.extend({
  comments: DS.belongsTo('post-comments', {async: true}),
  images: belongsTo('images', {async: true}),
  pingbacks: DS.belongsTo('pingbacks'),
  links: belongsTo('links'),
  subposts: DS.belongsTo('posts', {polymorphic: true}),
  variables: belongsTo('variables', {polymorphic: true}),
});

export default Post;
