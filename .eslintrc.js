module.exports = {
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/vue3-essential',
		'@vue/airbnb',
	],
	parserOptions: {
		parser: '@babel/eslint-parser',
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-tabs': 'off',
		indent: ['error', 'tab'],
		'max-len': ['error', { code: 5000 }],
		'vue/multi-word-component-names': ['error', {
			ignores: ['Modal']
		}],
		'vuejs-accessibility/label-has-for': ['error', {
			required: {
				some: ['nesting', 'id']
			}
		}],
		'no-undef': 'error',
		'arrow-parens': ['error', 'always'],
		'comma-dangle': ['error', 'always-multiline'],
		'implicit-arrow-linebreak': ['error', 'beside'],
		'function-paren-newline': ['error', 'multiline'],
		'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }]
	},
};
