import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const tailwindConfig: Config = {
  content: [
    './src/routes/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/*.tsx',
  ],
  theme: {
    fontFamily: {
      sans: ['Pretendard', ...fontFamily.sans],
    },
    extend: {
      // color
      backgroundColor: {
        primary: 'var(--purple-500)',
        secondary: 'var(--purple-200)',
        teritary: 'var(--purple-100)',
        darkAlt: 'var(--grey-700)',
        alt: 'var(--grey-500)',
        weak: 'var(--grey-50)',
        altWeak: 'var(--grey-700)',
        white: 'var(--white)',
        black: 'var(--black)',
        overlay: 'var(--black-alpha-60)',
        error: 'var(--red)',
      },
      textColor: {
        main: 'var(--black)',
        alt: 'var(--grey-900)',
        hover: 'var(--grey-800)',
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
      fill: {
        primary: 'var(--purple-500)',
        main: 'var(--grey-900)',
        weak: 'var(--grey-700)',
        white: 'var(--white)',
        error: 'var(--red)',
      },

      // font
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
            fontWeight: '400',
          },
        ],
        body2: [
          '0.875rem',
          {
            lineHeight: '20px',
            fontWeight: '400',
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
            fontWeight: '400',
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

      // borderRadius
      borderRadius: {
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px',
      },

      // boxShadow
      boxShadow: {
        normal: '0px 1px 2px 0px var(--grey-500)',
        up: '0px 2px 8px 0px var(--grey-500)',
        floating: '0px 16px 28px 0px var(--grey-500), 0px 0px 4px 0px var(--grey-500)',
      },

      // animation
      animation: {
        flashWhite: 'flashWhite 1s ease-out infinite alternate',
        flashPrimary: 'flashPurple   1s ease-out infinite alternate',
        'bounce-in-bottom': 'bounceInBottom 300ms both',
        'bounce-out-bottom': 'bounceOutBottom 300ms both',
      },

      // keyframes
      keyframes: {
        flashWhite: {
          '0%, 100%': {
            backgroundColor: 'var(--grey-700)',
          },
          '50%': {
            backgroundColor: 'var(--white)',
          },
        },
        flashPrimary: {
          '0%, 100%': {
            backgroundColor: 'var(--purple-200)',
          },
          '50%': {
            backgroundColor: 'var(--purple-500)',
          },
        },
        bounceInBottom: {
          from: {
            opacity: '0',
            transform: 'translate3d(0, -30px, 0)',
          },
          to: {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        bounceOutBottom: {
          '20%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
          to: {
            opacity: '0',
            transform: 'translate3d(0, 30px, 0)',
          },
        },
      },
    },
  },
};

export default tailwindConfig;
