/**
 * Tailwind v4 primarily uses CSS `@theme` in globals.css.
 * This config is kept minimal for compatibility and editor tooling.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#2C345F',
          800: '#3C467B',
          700: '#50589C',
          600: '#636CCB',
          500: '#6E8CFB',
        },
        ink: {
          900: '#0B102A',
          700: '#374151',
          500: '#6B7280',
          300: '#D1D5DB',
        },
      },
      borderRadius: { sm: '6px', md: '10px', lg: '12px' },
      boxShadow: {
        1: '0 1px 2px rgba(0,0,0,.06)',
        2: '0 6px 24px rgba(0,0,0,.08)',
      },
      maxWidth: { content: '64rem' },
    },
  },
  plugins: [],
};
  
