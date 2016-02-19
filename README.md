# postcss-resolve-nested-selector

Resolve a nested selector in a PostCSS AST.

## API

`resolveNestedSelector(selector, node)`

Returns an array of selectors resolved from `selector`.

For example, given this JS:

```js
var resolvedNestedSelector = require('postcss-resolve-nested-selector');
postcssRoot.eachRule(function(rule) {
  var resolvedSelectors = rule.selectors.map(function(selector) {
    return resolvedNestedSelector(selector, rule);
  });
});
```

And the following CSS:

```css
.foo {
  .bar {
    color: pink;
  }
}
```

This should log:

```
['.foo']
['.foo .bar']
```

Or with this CSS:

```css
.foo {
  .bar &,
  a {
    color: pink;
  }
}
```

This should log:

```
['.foo']
['.bar .foo']
['.foo a']
```
