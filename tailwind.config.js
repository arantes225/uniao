/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uniao: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // turquesa vibrante
          600: '#0d9488', // turquesa principal da marca
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a', // verde-petróleo profundo
          950: '#042f2e',
        },
        navy: {
          900: '#0a192f',
          950: '#050c18',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'premium': '0 20px 40px -15px rgba(13, 148, 136, 0.12)',
      }
    },
  },
  plugins: [],
}
