# postcss-resolve-nested-selector

Given a (nested) selector in a PostCSS AST, return an array of resolved selectors.

Tested to work with the syntax of
[postcss-nested](https://github.com/postcss/postcss-nested)
and [postcss-nesting](https://github.com/jonathantneal/postcss-nesting).
Should also work with SCSS and Less syntax. If you'd like to help out by
adding some automated tests for those, that'd be swell. In fact, if you'd
like to add any automated tests, you are a winner!

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
