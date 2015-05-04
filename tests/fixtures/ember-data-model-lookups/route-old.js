import Ember from 'ember';
import Post from 'my-app/models/post';

export default Ember.Route.extend({
  model: function() {
    return this.store.createRecord(Post, {
      title: 'DHHHHHHHHHHHH'
    });
  },

  afterModel: function(model) {
    return this.store.find(Post);
  },

  actions: {

    findOne: function(){
      return this.store.findById(Post, '1');
    },

    findQuery: function(){
      return this.store.findQuery(Post, {foo: 'bar'})
    },

    findSerializer: function(){
      return this.store.serializerFor(Post);
    },

    findMetaForType: function(){
      return this.store.metaForType(Post);
    },

    pushMany: function(){
      return this.store.pushMany(Post, []);
    },

    update: function(){
      return this.store.update(Post, {id: '1'});
    },

    normalize: function(){
      return this.store.normalize(Post, {});
    },

    pushPayload: function(){
      return this.store.pushPayload(Post, {});
    },

    push: function(){
      return this.store.push(Post, {});
    },

    modelFactoryFor: function(){
      return this.store.modelFactoryFor(Post);
    },

    modelFor: function(){
      return this.store.modelFor(Post);
    },

    setMetaDataFor: function(){
      return this.store.setMetadataFor(Post, {});
    },

    recordIsLoaded: function(){
      return this.store.recordIsLoaded(Post, '1');
    },

    filter: function(){
      return this.store.filter(Post, {}, function(post) {
        return post.get('published');
      });
    },

    unloadAll: function(){
      return this.store.unloadAll(Post);
    },

    recordForId: function(){
      return this.store.recordForId(Post, '1');
    },

    hasRecordForId: function(){
      return this.store.hasRecordForId(Post, '1');
    },

    getById: function(){
      return this.store.getById(Post, '1');
    },

    findByIds: function(){
      return this.store.findByIds(Post, ['1', '2', '3']);
    }
  }
});
