/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dell-blue': '#0076CE',
        'dell-blue-dark': '#005A9E',
        'ink': '#132043',
        'muted': '#5B6472',
        'canvas': '#F4F6FA',
        'panel': '#EDF0F6',
        amber: '#F2994A',
        'amber-dark': '#D97C2B',
        'strength-green': '#1E8E3E',
        'strength-yellow': '#B98900',
        'strength-red': '#D93025',
        // legacy aliases kept so existing class names don't break
        'dell-gray': '#132043',
        'dell-gray-light': '#EDF0F6',
        'dell-tip': '#EAF1FB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(19,32,67,0.06), 0 6px 16px rgba(19,32,67,0.06)',
        pop: '0 10px 30px rgba(19,32,67,0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
