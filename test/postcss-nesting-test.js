import test from 'ava';
import util from './util';

// tests copied from https://github.com/jonathantneal/postcss-nesting

test('postcss-nesting Test Case 1', async t => {
	const code = `a, b {
		color: white;

		@nest & c, & d {
			color: blue;
		}
	}`;
	t.deepEqual(
		await util.postcssNestingResolve(code),
		await util.allExpected(code),
	);
	t.deepEqual(
		await util.allExpected(code),
		['a', 'a c', 'a d', 'b', 'b c', 'b d'],
	);
});


test('postcss-nesting Test Case 2', async t => {
	const code = `a, b {
		color: white;

		@nest & c, & d {
			color: blue;

			@nest & e, & f {
				color: black;
			}
		}
	}`;
	t.deepEqual(
		await util.postcssNestingResolve(code),
		await util.allExpected(code),
	);
	t.deepEqual(
		await util.allExpected(code),
		['a', 'a c', 'a c e', 'a c f', 'a d', 'a d e', 'a d f',
		'b', 'b c', 'b c e', 'b c f', 'b d', 'b d e', 'b d f'],
	);
});

test('postcss-nesting Test Case 3', async t => {
	const code = `a, b {
		color: red;

		@nest & & {
			color: white;
		}
	}`;
	t.deepEqual(
		await util.postcssNestingResolve(code),
		await util.allExpected(code),
	);
	t.deepEqual(
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
	t.deepEqual(
		await util.postcssNestingResolve(code),
		await util.allExpected(code),
	);
	t.deepEqual(
		await util.allExpected(code),
		['a', 'a'],
	);
});

test('postcss-nesting Test Case 5', async t => {
	const code = `a {
		color: red;

		@nest & b {
			color: white;

			@media {
				color: blue;
			}
		}

		@media {
			color: black;

			@nest & c {
				color: yellow;
			}
		}
	}`;
	t.deepEqual(
		await util.postcssNestingResolve(code),
		await util.allExpected(code),
	);
	t.deepEqual(
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
	t.deepEqual(
		await util.postcssNestingResolve(code),
		await util.allExpected(code),
	);
	t.deepEqual(
		await util.allExpected(code),
		['a', 'a', 'a b', 'a b', 'a c'],
	);
});
