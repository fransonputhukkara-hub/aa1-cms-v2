/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: '#6a1b2d',
        'wine-deep': '#4e1320',
        gold: '#c79a3e',
        'gold-soft': '#e3c987',
        ivory: '#f7f2e9',
        cream: '#fbf8f1',
        ink: '#2b1c1c',
        'ink-soft': '#6b5a55',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Jost', 'sans-serif'],
        script: ['"Pinyon Script"', 'cursive'],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'none' } },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        fadeUp: 'fadeUp .9s .15s cubic-bezier(.2,.7,.2,1) forwards',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [],
};
