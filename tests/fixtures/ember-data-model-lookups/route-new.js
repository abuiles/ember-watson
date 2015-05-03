import Ember from 'ember';
import Post from 'my-app/models/post';

export default Ember.Route.extend({
  model: function() {
    return this.store.createRecord('post', {
      title: 'DHHHHHHHHHHHH'
    });
  },

  afterModel: function(model) {
    return this.store.find('post');
  },

  actions: {

    findOne: function(){
      return this.store.findById('post', '1');
    },

    findQuery: function(){
      return this.store.findQuery('post', {foo: 'bar'})
    },

    findSerializer: function(){
      return this.store.serializerFor('post');
    },

    findMetaForType: function(){
      return this.store.metaForType('post');
    },

    pushMany: function(){
      return this.store.pushMany('post', []);
    },

    update: function(){
      return this.store.update('post', {id: '1'});
    },

    normalize: function(){
      return this.store.normalize('post', {});
    },

    pushPayload: function(){
      return this.store.pushPayload('post', {});
    },

    push: function(){
      return this.store.push('post', {});
    },

    modelFactoryFor: function(){
      return this.store.modelFactoryFor('post');
    },

    modelFor: function(){
      return this.store.modelFor('post');
    },

    setMetaDataFor: function(){
      return this.store.setMetadataFor('post', {});
    },

    recordIsLoaded: function(){
      return this.store.recordIsLoaded('post', '1');
    },

    filter: function(){
      return this.store.filter('post', {}, function(post) {
        return post.get('published');
      });
    },

    unloadAll: function(){
      return this.store.unloadAll('post');
    },

    recordForId: function(){
      return this.store.recordForId('post', '1');
    },

    hasRecordForId: function(){
      return this.store.hasRecordForId('post', '1');
    },

    getById: function(){
      return this.store.getById('post', '1');
    },

    findByIds: function(){
      return this.store.findByIds('post', ['1', '2', '3']);
    }
  }
});
