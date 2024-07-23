import test from 'node:test';
import assert from 'node:assert/strict';
import util from './util.mjs';

// tests copied from https://github.com/jonathantneal/postcss-nesting

test('postcss-nesting Test Case 1', async t => {
	const code = `a, b {
		color: white;

		& c, & d {
			color: blue;
		}
	}`;
	assert.deepEqual(
		await util.postcssNestedResolve(code),
		await util.allExpected(code),
	);
	assert.deepEqual(
		await util.allExpected(code),
		['a', 'a c', 'a d', 'b', 'b c', 'b d'],
	);
});


test('postcss-nesting Test Case 2', async t => {
	const code = `a, b {
		color: white;

		& c, & d {
			color: blue;

			& e, & f {
				color: black;
			}
		}
	}`;
	assert.deepEqual(
		await util.postcssNestedResolve(code),
		await util.allExpected(code),
	);
	assert.deepEqual(
		await util.allExpected(code),
		['a', 'a c', 'a c e', 'a c f', 'a d', 'a d e', 'a d f',
		'b', 'b c', 'b c e', 'b c f', 'b d', 'b d e', 'b d f'],
	);
});

test('postcss-nesting Test Case 3', async t => {
	const code = `a, b {
		color: red;

		& & {
			color: white;
		}
	}`;
	assert.deepEqual(
		await util.postcssNestedResolve(code),
		await util.allExpected(code),
	);
	assert.deepEqual(
		await util.allExpected(code),
		['a', 'a a', 'b', 'b b'],
	);
});

test('postcss-nesting Test Case 4', async t => {
	const code = `a {
		color: red;

		@media {
			color: white;
		}
	}`;
	assert.deepEqual(
		await util.postcssNestedResolve(code),
		await util.allExpected(code),
	);
	assert.deepEqual(
		await util.allExpected(code),
		['a', 'a'],
	);
});

test('postcss-nesting Test Case 5', async t => {
	const code = `a {
		color: red;

		& b {
			color: white;

			@media {
				color: blue;
			}
		}

		@media {
			color: black;

			& c {
				color: yellow;
			}
		}
	}`;
	assert.deepEqual(
		await util.postcssNestedResolve(code),
		await util.allExpected(code),
	);
	assert.deepEqual(
		await util.allExpected(code),
		['a', 'a', 'a b', 'a b', 'a c'],
	);
});

test('postcss-nesting Test Case 6', async t => {
	const code = `a {
		color: red;

		& b {
			color: white;

			@media {
				color: blue
			}
		}

		@media {
			color: black;

			& c {
				color: yellow
			}
		}
	}`;
	assert.deepEqual(
		await util.postcssNestedResolve(code),
		await util.allExpected(code),
	);
	assert.deepEqual(
		await util.allExpected(code),
		['a', 'a', 'a b', 'a b', 'a c'],
	);
});
