/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['Instrument Sans', 'Geist', 'Inter', 'sans-serif'],
      },
      colors: {
        atlas: {
          bg0: '#0F1217',
          bg1: '#151A21',
          surface: '#1B222C',
          elev: '#232C38',
          text: '#EAF0F8',
          muted: '#9AA7B7',
          brand: '#4C7DFF',
          ember: '#FF7A45',
          call: '#5B8CFF',
          mutation: '#FF8F5A',
          loop: '#2FBF8F',
          error: '#E45454',
          ref: '#8F7CFF',
        },
      },
      boxShadow: {
        atlas: '0 22px 70px rgba(8, 12, 20, 0.35)',
        'atlas-soft': '0 10px 28px rgba(12, 16, 24, 0.24)',
      },
    },
  },
  plugins: [],
}
