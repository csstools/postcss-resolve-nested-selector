module.exports = function resolveNestedSelector(selector, node) {
  var parent = node.parent;
  if (parent.type === 'root') return [selector];
  if (parent.type !== 'rule') return resolveNestedSelector(selector, parent);

  var resolvedSelectors = parent.selectors.reduce(function(result, parentSelector) {
    if (selector.indexOf('&') !== -1) {
      var newlyResolvedSelectors = resolveNestedSelector(parentSelector, parent).map(function(resolvedParentSelector) {
        return selector.replace(/&/g, resolvedParentSelector);
      });
      return result.concat(newlyResolvedSelectors);
    }

    var combinedSelector = [ parentSelector, selector ].join(' ');
    return result.concat(resolveNestedSelector(combinedSelector, parent));
  }, []);

  return resolvedSelectors;
}
