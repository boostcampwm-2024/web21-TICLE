import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/*.tsx',
  ],
  theme: {
    fontFamily: {
      sans: ['Pretendard', ...fontFamily.sans],
    },
    extend: {
      backgroundColor: {
        primary: 'var(--purple-500)',
        secondary: 'var(--purple-200)',
        teritary: 'var(--purple-100)',
        alt: 'var(--grey-500)',
        weak: 'var(--grey-50)',
        white: 'var(--white)',
        black: 'var(--black)',
        overlay: 'var(--black-alpha-60)',
      },
      textColor: {
        main: 'var(--black)',
        alt: 'var(--grey-900)',
        weak: 'var(--grey-700)',
        primary: 'var(--purple-500)',
        white: 'var(--white)',
        error: 'var(--red)',
      },
      borderColor: {
        main: 'var(--grey-300)',
        primary: 'var(--purple-500)',
        error: 'var(--red)',
      },
    },
  },
};

export default config;
