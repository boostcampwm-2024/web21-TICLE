const pathsConfig = require('./paths');
const namingConfig = require('./naming');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
  },
  env: {
    es2023: true,
    browser: true,
    node: true,
  },
  settings: {
    ...pathsConfig.settings,
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],

    // 기본 규칙
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-undef': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // 분리된 규칙들 병합
    ...namingConfig.rules,
    ...pathsConfig.rules,
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.eslintrc.js'],
};
