/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dell-blue': '#0076CE',
        'dell-blue-dark': '#005A9E',
        'dell-gray': '#444444',
        'dell-gray-light': '#F5F5F5',
        'dell-tip': '#E6F2FF',
        'strength-green': '#1E8E3E',
        'strength-yellow': '#B98900',
        'strength-red': '#D93025',
      },
      fontFamily: {
        sans: ['Inter', 'Open Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
