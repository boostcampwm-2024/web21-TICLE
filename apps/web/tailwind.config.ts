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
      // colors
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

      // fonts
      fontSize: {
        head1: [
          '1.75rem',
          {
            lineHeight: '34px',
            fontWeight: '700',
          },
        ],
        head2: [
          '1.5rem',
          {
            lineHeight: '30px',
            fontWeight: '700',
          },
        ],
        head3: [
          '1.25rem',
          {
            lineHeight: '28px',
            fontWeight: '700',
          },
        ],
        title1: [
          '1.125rem',
          {
            lineHeight: '24px',
            fontWeight: '600',
          },
        ],
        title2: [
          '1rem',
          {
            lineHeight: '20px',
            fontWeight: '600',
          },
        ],
        body1: [
          '1rem',
          {
            lineHeight: '24px',
            fontWeight: '500',
          },
        ],
        body2: [
          '0.875rem',
          {
            lineHeight: '20px',
            fontWeight: '500',
          },
        ],
        body3: [
          '0.875rem',
          {
            lineHeight: '20px',
            fontWeight: '400',
          },
        ],
        body4: [
          '0.75rem',
          {
            lineHeight: '16px',
            fontWeight: '500',
          },
        ],
        label1: [
          '0.875rem',
          {
            lineHeight: '16px',
            fontWeight: '600',
          },
        ],
      },
    },
  },
};

export default config;
