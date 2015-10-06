var parseAst    = require('../helpers/parse-ast');
var recast      = require('recast');
var b    = recast.types.builders;
var isImportFor = require('./helpers/is-import-for');
var addDefaultImport = require('./helpers/add-default-import');

module.exports = function transform(source) {
  var ast = parseAst(source);
  var needs, emberImport;
  var uses = [];
  recast.visit(ast, {
    visitProperty: function(path) {
      if(isNeedsDeclaration(path)) {
        needs = path;
        return false;
      }
      this.traverse(path);
    },
    visitLiteral: function(path) {
      if (isNeedsUsage(path)) {
        uses.push(path);
      }
      this.traverse(path);
    },
    visitImportDeclaration: function(path) {
      if (isImportFor('ember', path.node)) {
        emberImport = path;
      }
      this.traverse(path);
    },
  });

  transformNeeds(ast, needs, uses, emberImport);
  return recast.print(ast, { tabWidth: 2, quote: 'single' }).code;
};

function transformNeeds(ast, needs, uses, emberImport) {
  if (needs) {
    // What is Ember imported as?
    var emberIdentifier = getEmberImportName(ast, emberImport);
    // Get a normal array of needs names
    var needsArray = normaliseNeeds(needs);
    // Generate a map from controller path to new property names
    var newKeysMap = generateNewKeysMap(needsArray);
    // Update the paths
    replaceNeedsProperty(emberIdentifier, needs, newKeysMap);
    if (uses.length > 0) {
      transformUses(uses, newKeysMap);
    }
  }
}

var replaceNeedsProperty = function(emberIdentifier, path, newKeyMap) {
  var replacements = [];
  if (path.value.value.elements) {
    path.value.value.elements.forEach(function(element) {
      path.parentPath.unshift(buildInjectionExpression(emberIdentifier, element.value, newKeyMap));
    });
    path.replace();
  } else {
    path.replace(buildInjectionExpression(emberIdentifier, path.value.value.value, newKeyMap));
  }
};

var transformUses = function(paths, newKeyMap) {
  paths.forEach(function(path) {
    for(var prop in newKeyMap) {
      var regex = new RegExp('controllers\\.' + prop + '(\\.|$)');
      var match = path.value.value.match(regex);
      if (match) {
        var newLiteral = path.value.value.replace(regex, newKeyMap[prop] + match[1]);
        path.replace(b.literal(newLiteral));
      }
    }
  });
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function invertMap(map) {
  var invertedMap = {};
  for(var prop in map) {
    if(map.hasOwnProperty(prop)) {
      invertedMap[map[prop]] = prop;
    }
  }
  return invertedMap;
}

var generateNewKeysMap = function(needsArray) {
  var newKeys = {};
  needsArray.forEach(function(needsNode) {
    var needsValue = needsNode.value;
    var needsParts = needsValue.split('/');
    var key = 'Controller';
    do {
      key = capitalizeFirstLetter(key);
      key = needsParts.pop().replace(/-/g, '') + key;
    } while(newKeys[key] !== undefined);
    newKeys[key] = needsValue;
  });
  return invertMap(newKeys);
};

function isNeedsUsage(path) {
  return path &&
    path.value &&
    typeof path.value.value === 'string' &&
    path.value.value.indexOf('controllers.') === 0;
}

function isNeedsDeclaration(path) {
  return path.value.key.name === 'needs';
}

function normaliseNeeds(needs) {
  var needsArray = needs.value.value.elements;
  if (needsArray === undefined) {
    needsArray = [needs.value.value];
  }
  return needsArray;
}

function getEmberImportName(ast, emberImport) {
  if (!emberImport) {
    addDefaultImport(ast, 'ember', 'Ember');
    emberIdentifier = 'Ember';
  } else {
    emberIdentifier = emberImport.value.specifiers[0].local.name;
  }
  return emberIdentifier;
}

var buildInjectionExpression = function(emberIdentifier, controllerPath, newKeyMap) {
  var name = newKeyMap[controllerPath];
  return b.property(
    'init',
    b.identifier(name),
    b.callExpression(
      b.memberExpression(
        b.identifier(emberIdentifier),
        b.memberExpression(
          b.identifier("inject"),
          b.identifier("controller"),
          false
        ),
        false
      ),
      [b.literal(controllerPath)]
    )
  );
};