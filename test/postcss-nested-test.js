import test from 'ava';
import util from './util';

// tests copied from https://github.com/postcss/postcss-nested

test('postcss-nested unwraps rule inside rule', async t => {
  const code = 'a { a: 1 } a { a: 1; b { b: 2; c { c: 3 } } }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a', 'a', 'a b', 'a b c'],
  );
});

test('postcss-nested cleans rules after unwrap', async t => {
  const code = 'a { b .one {} b .two {} }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a b .one', 'a b .two'],
  );
});

test('postcss-nested replaces ampersand', async t => {
  const code = 'a { body &:hover b {} }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['body a:hover b'],
  );
});

test('postcss-nested replaces ampersands', async t => {
  const code = 'a { &:hover, &:active {} }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a:active', 'a:hover'],
  );
});

test('postcss-nested replaces ampersand in string', async t => {
  const code = '.block { &_elem {} }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['.block_elem'],
  );
});

test('postcss-nested unwrap rules inside at-rules', async t => {
  const code = '@media (max-width: 500px) { a { b {} } }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a b'],
  );
});

test('postcss-nested unwraps at-rule', async t => {
  const code = 'a { b { @media screen { width: auto } } }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a b'],
  );
});

test('postcss-nested unwraps at-rule with rules', async t => {
  const code = 'a { @media screen { b { color: black } } }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a b'],
  );
});

test('postcss-nested unwraps at-rules', async t => {
  const code = 'a { a: 1 } a { @media screen { @supports (a: 1) { a: 1 } } }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a', 'a'],
  );
});

test('postcss-nested processes comma', async t => {
  const code = '.one, .two { a {} }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['.one a', '.two a'],
  );
});

test('postcss-nested processes comma with ampersand', async t => {
  const code = '.one, .two { &:hover {} }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['.one:hover', '.two:hover'],
  );
});

test('postcss-nested processes comma inside', async t => {
  const code = 'a, b { .one, .two {} }';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a .one', 'a .two', 'b .one', 'b .two'],
  );
});

test('postcss-nested moves comment with rule', async t => {
  const code = 'a {\n    /*B*/\n    b {}\n}';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a b'],
  );
});

test('postcss-nested moves comment with at-rule', async t => {
  const code = 'a {\n    /*B*/\n    @media {\n        one: 1\n    }\n}';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a'],
  );
});

test('postcss-nested moves comment with declaration', async t => {
  const code = 'a {\n    @media {\n        /*B*/\n        one: 1\n    }\n}';
  t.same(
    await util.postcssNestedResolve(code),
    await util.expected(code),
  );
  t.same(
    await util.expected(code),
    ['a'],
  );
});
