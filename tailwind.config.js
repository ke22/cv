/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a1a',
          dark: '#000000',
        },
        secondary: '#4a4a4a',
        accent: {
          DEFAULT: '#2d5016',
          light: '#4a7c2a',
        },
        base: {
          DEFAULT: '#ffffff',
          light: '#f8f8f8',
        },
        border: '#e0e0e0',
        text: {
          dark: '#1a1a1a',
          light: '#666',
        },
        track: {
          a: '#2563eb',
          b: '#7c3aed',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Microsoft JhengHei',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '2rem',
        'lg': '4rem',
        'xl': '6rem',
      },
    },
  },
  plugins: [],
}
