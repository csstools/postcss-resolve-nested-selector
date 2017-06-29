var postcss = require('postcss');
var postcssNested = require('postcss-nested');
var postcssNesting = require('postcss-nesting');
var resolveNestedSelector = require('..');

function actualResolvedSelector(plugin, code) {
  return postcss(plugin).process(code).then(function(result) {
    var resolvedSelectors = [];
    result.root.walkRules(function(rule) {
      resolvedSelectors = resolvedSelectors.concat(rule.selectors);
    });
    return resolvedSelectors.sort();
  }).catch(function(err) {
    console.log(err.stack);
  });
}

function postcssNestedResolve(code) {
  return actualResolvedSelector(postcssNested(), code);
}

function postcssNestingResolve(code) {
  return actualResolvedSelector(postcssNesting(), code);
}

function allExpected(code) {
  const codeWithoutAtNest = code.replace(/@nest /g, '/*@nest */');
  return postcss().process(codeWithoutAtNest).then(function(result) {
    var resolvedSelectors = [];
    result.root.walk(function(node) {
      if (node.type !== 'rule' && node.type !== 'atrule') return;

      let nodeContainsDeclChild = false;
      node.walk(function(descendant) {
        if (descendant.type === 'decl') {
          nodeContainsDeclChild = true;
          return false;
        }
      });

      var nodeContainsBlockDescendant = false;
      node.walk(function(descendant) {
        if (descendant.type === 'rule' || descendant.type === 'atrule') {
          nodeContainsBlockDescendant = true;
          return false;
        }
      });

      if (node.type !== 'atrule' && !nodeContainsDeclChild && nodeContainsBlockDescendant) return;
      if (node.type === 'atrule' && !nodeContainsDeclChild) return;

      var selectors;
      if (node.type === 'atrule') {
        if (node.name === 'nest') {
          selectors = postcss.list.comma(node.params);
        } else {
          selectors = ['&'];
        }
      } else {
        selectors = node.selectors;
      }

      selectors.forEach(function(selector) {
        resolvedSelectors = resolvedSelectors.concat(resolveNestedSelector(selector, node));
      });
    });
    return resolvedSelectors.sort();
  }).catch(function(err) {
    console.log(err.stack);
  });
}

function resolveChosenSelector(code, chosenSelector) {
  return postcss().process(code).then(function(result) {
    var chosenNode;
    result.root.walk(function(node) {
      if (node.type !== 'rule' && node.type !== 'atrule') return;
      if (node.type === 'atrule' && node.name !== 'nest') return;

      var selectors = (node.type === 'atrule')
        ? node.params.split(',')
        : node.selectors;

      for (var i = 0, l = selectors.length; i < l; i++) {
        if (selectors[i] === chosenSelector) {
          chosenNode = node;
          return false;
        }
      }
    });
    if (!chosenNode) throw new Error ('The chosen node was not discovered!');
    return resolveNestedSelector(chosenSelector, chosenNode).sort();
  });
}

module.exports = {
  actualResolvedSelector: actualResolvedSelector,
  postcssNestedResolve: postcssNestedResolve,
  postcssNestingResolve: postcssNestingResolve,
  allExpected: allExpected,
  resolveChosenSelector: resolveChosenSelector,
};
