const path = require('path');

const baseConfig = path.resolve(__dirname, 'tsconfig.json');
const appConfig = path.resolve(__dirname, 'tsconfig.app.json');
const nodeConfig = path.resolve(__dirname, 'tsconfig.node.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    require.resolve('@repo/lint'),
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/jsx-runtime',
  ],
  plugins: ['react-refresh'],
  settings: {
    react: {
      version: '18.3.0',
    },
    'import/resolver': {
      typescript: {
        project: [baseConfig, appConfig, nodeConfig],
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  parserOptions: {
    project: [baseConfig, appConfig, nodeConfig],
    ecmaFeatures: { jsx: true },
  },
  ignorePatterns: ['dist', '.eslintrc.cjs', 'postcss.config.cjs', 'tailwind.config.ts'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'import/no-unresolved': ['error', { ignore: ['^/'] }],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/jsx-boolean-value': ['error', 'never'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'import/no-duplicates': 'error',
    'no-console': 'error',
  },
};
