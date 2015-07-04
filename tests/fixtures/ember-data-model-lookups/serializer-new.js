import DS from 'ember-data';

export default DS.ActiveModelSerializer.exend({
  all: function(foo) {
    this.store.all(foo.bar);
  },
  createRecord: function(foo) {
    this.store.createRecord(foo.bar);
  },
  filter: function(foo) {
    this.store.filter(foo.bar);
  },
  find: function(foo) {
    this.store.find(foo.bar);
  },
  fetch: function(foo) {
    this.store.fetch(foo.bar);
  },
  fetchAll: function(foo) {
    this.store.fetchAll(foo.bar);
  },
  findById: function(foo) {
    this.store.findById(foo.bar);
  },
  findByIds: function(foo) {
    this.store.findByIds(foo.bar);
  },
  findQuery: function(foo) {
    this.store.findQuery(foo.bar);
  },
  getById: function(foo) {
    this.store.getById(foo.bar);
  },
  hasRecordForId: function(foo) {
    this.store.hasRecordForId(foo.bar);
  },
  metaForType: function(foo) {
    this.store.metaForType(foo.bar);
  },
  modelFor: function(foo) {
    this.store.modelFor(foo.bar);
  },
  modelFactoryFor: function(foo) {
    this.store.modelFactoryFor(foo.bar);
  },
  normalize: function(foo) {
    this.store.normalize(foo.bar);
  },
  push: function(foo) {
    this.store.push(foo.bar);
  },
  pushMany: function(foo) {
    this.store.pushMany(foo.bar);
  },
  pushPayload: function(foo) {
    this.store.pushPayload(foo.bar);
  },
  recordForId: function(foo) {
    this.store.recordForId(foo.bar);
  },
  recordIsLoaded: function(foo) {
    this.store.recordIsLoaded(foo.bar);
  },
  update: function(foo) {
    this.store.update(foo.bar);
  },
  serializerFor: function(foo) {
    this.store.serializerFor(foo.bar);
  },
  setMetadataFor: function(foo) {
    this.store.setMetadataFor(foo.bar);
  },
  unloadAll: function(foo) {
    this.store.unloadAll(foo.bar);
  }
});
