/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily:{
        'barlow':"'Barlow',sans-serif",
        'sans': ['Barlow', ...defaultTheme.fontFamily.sans],
      },
      colors:{
        'background-grey':'var(--color-background-grey)'
      },
      textColor :{
        skin: {
          base: 'var(--color-text-base)',
          muted: 'var(--color-text-muted)',
          bold: 'var(--color-text-bold)',
          up: 'var(--color-text-green)',
          down: 'var(--color-text-red)',
          select: 'var(--color-text-blue)',
        }
      },
      borderColor:{
        skin: {
          background: 'var(--color-background-grey)',
          select: 'var(--color-text-blue)',
        }
      },
      backgroundColor:{
        skin: {
          grey: 'var(--color-background-grey)',
          hover: 'var(--color-background-hover)',
          sell: 'var(--color-background-red)',
          buy: 'var(--color-background-green)',
          select: 'var(--color-background-blue)'
        }
      },
    },
  },
  plugins: [],
};
