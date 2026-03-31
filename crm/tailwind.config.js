/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020913',
          900: '#05101c',
          800: '#091627',
          700: '#0c1b2e',
          600: '#132742',
        },
        accent: '#5ef6ee',
        'accent-light': '#7dfff8',
        gold: '#f0c26e',
        'gold-light': '#f5d48e',
        line: 'rgba(121,166,213,.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
