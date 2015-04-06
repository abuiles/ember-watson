module.exports = function isImportFor(module, node) {
  return node.source.type === 'ModuleSpecifier' &&
    node.source.value === module;
};
