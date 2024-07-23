import postcss from 'postcss';
import postcssNested from 'postcss-nested';
import resolveNestedSelector from '../index.js';

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

function allExpected(code) {
	const codeWithoutAtNest = code.replace(/@nest /g, '/*@nest */');
	return postcss().process(codeWithoutAtNest).then(function(result) {
		var resolvedSelectors = [];
		result.root.walk(function(node) {
			if (node.type !== 'rule' && node.type !== 'atrule') return;

			const nodeContainsDeclChild = node.some(function(descendant) {
				return descendant.type === 'decl';
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

			var selectors = (node.type === 'atrule') ? ['&'] : node.selectors;
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

export default {
	actualResolvedSelector: actualResolvedSelector,
	postcssNestedResolve: postcssNestedResolve,
	allExpected: allExpected,
	resolveChosenSelector: resolveChosenSelector,
};
