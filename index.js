module.exports = function resolveNestedSelector(selector, node) {
	var parent = node.parent;
	var parentIsNestAtRule = parent.type === 'atrule' && parent.name === 'nest';

	if (parent.type === 'root') return [selector];
	if (parent.type !== 'rule' && !parentIsNestAtRule) return resolveNestedSelector(selector, parent);

	var parentSelectors = (parentIsNestAtRule)
		? list(parent.params)
		: parent.selectors;

	var resolvedSelectors = parentSelectors.reduce(function(result, parentSelector) {
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

// https://github.com/postcss/postcss/blob/main/lib/list.js#L1
// We should not have `postcss` as a direct dependency so, we inline the same code here.
function list(string) {
	let array = []
	let current = ''
	let split = false

	let func = 0
	let inQuote = false
	let prevQuote = ''
	let escape = false

	for (let letter of string) {
		if (escape) {
			escape = false
		} else if (letter === '\\') {
			escape = true
		} else if (inQuote) {
			if (letter === prevQuote) {
				inQuote = false
			}
		} else if (letter === '"' || letter === "'") {
			inQuote = true
			prevQuote = letter
		} else if (letter === '(') {
			func += 1
		} else if (letter === ')') {
			if (func > 0) func -= 1
		} else if (func === 0) {
			if (letter === ',') split = true
		}

		if (split) {
			if (current !== '') array.push(current.trim())
			current = ''
			split = false
		} else {
			current += letter
		}
	}

	if (current !== '') array.push(current.trim())
	return array
}
