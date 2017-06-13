import test from 'ava';
import resolveNestedSelector from '..';
import util from './util';

test(async t => {
  const code = `a { b { top: 0; c { d {}}}}`;
  t.deepEqual(
    await util.resolveChosenSelector(code, 'd'),
    ['a b c d'],
  );
});

test(async t => {
  const code = `.foo { .bar &, a {}}`;
  t.deepEqual(
    await util.resolveChosenSelector(code, '.bar &'),
    ['.bar .foo'],
  );
});

test(async t => {
  const code = `.foo { .bar &, a, & + &:hover { b {}}}`;
  t.deepEqual(
    await util.resolveChosenSelector(code, 'b'),
    ['.bar .foo b', '.foo + .foo:hover b', '.foo a b'],
  );
});

test(async t => {
  const code = `.foo { @nest .bar &, & + &:hover { b {}}}`;
  t.deepEqual(
    await util.resolveChosenSelector(code, 'b'),
    ['.bar .foo b', '.foo + .foo:hover b'],
  );
});

test(async t => {
  const code = `.foo { .bar &, & + &:hover { c > & {}}}`;
  t.deepEqual(
    await util.resolveChosenSelector(code, 'c > &'),
    ['c > .bar .foo', 'c > .foo + .foo:hover'],
  );
});

test(async t => {
  const code = `.foo { @nest .bar &, & + &:hover { @nest c > & {}}}`;
  t.deepEqual(
    await util.resolveChosenSelector(code, 'c > &'),
    ['c > .bar .foo', 'c > .foo + .foo:hover'],
  );
});

test(async t => {
  const code = `.foo { &:hover, &_bar { > b {}}}`;
  t.deepEqual(
    await util.resolveChosenSelector(code, '> b'),
    ['.foo:hover > b', '.foo_bar > b'],
  );
});
