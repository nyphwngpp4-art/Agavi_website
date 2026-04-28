import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#C51432',
          50: '#FDE8EC',
          100: '#F9C5CD',
          200: '#F08A9A',
          300: '#E74F67',
          400: '#D62A47',
          500: '#C51432',
          600: '#A01029',
          700: '#7B0C20',
          800: '#560817',
          900: '#31040D',
          950: '#1A0207',
        },
        dark: {
          bg: '#0A0A0A',
          card: '#141414',
          elevated: '#1A1A1A',
          hover: '#242424',
          border: '#2A2A2A',
          muted: '#3A3A3A',
        },
        navy: '#081B26',
        tier: {
          rm: '#3B82F6',
          leader: '#C51432',
          president: '#D4A843',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
