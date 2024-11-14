const path = require('path');

const baseConfig = path.resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  env: { node: true, jest: true },
  extends: [require.resolve('@repo/lint')],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [baseConfig],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: [baseConfig],
      },
    },
  },
  ignorePatterns: ['.eslintrc.cjs'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
