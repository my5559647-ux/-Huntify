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
        teal: {
          bg: '#05161A',
          surface: '#072E33',
          panel: '#294D61',
          primary: '#0C7075',
          accent: '#03F3DA',
          soft: '#6DA5C0',
          light: '#F4FAFC',
          card: '#EAF4F7',
          hover: '#D5ECF0',
          border: '#B9DDE4',
          text: '#0B3C40',
        },
        bgLight: '#F4FAFC',
        bgDark: '#05161A',
      },
    },
  },
  plugins: [],
}
export default config