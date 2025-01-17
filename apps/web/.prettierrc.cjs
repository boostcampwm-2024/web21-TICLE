const rootConfig = require('../../.prettierrc.js');

module.exports = {
  ...rootConfig,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cn', 'clsx', 'twMerge', 'cva'],
};
