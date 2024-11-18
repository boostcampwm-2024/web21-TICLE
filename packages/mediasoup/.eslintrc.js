/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve('@repo/lint')],
  parserOptions: {
    project: './tsconfig.json',
  },
};
