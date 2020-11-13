/**@type {import('eslint').Linter.Config} */
const eslintConfig = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'guard-for-in': 'off',
    'no-unused-expressions': ['error', {'allowShortCircuit': true, 'allowTernary': true}],
    'no-restricted-syntax': 'off',
    'prefer-promise-reject-errors': 'off',
  },
};

module.exports = eslintConfig;
