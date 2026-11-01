export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: {
      navy: { DEFAULT: '#1D2B6B', 800: '#16205A', 600: '#4A5A9E', 200: '#CBD3F0', 100: '#E4E9FA', 50: '#F1F4FD' },
      crimson: { DEFAULT: '#7C3AED', 700: '#6D28D9', 100: '#EDE4FD' },
      blush: { DEFAULT: '#F5F8FF', 200: '#DCE8FF' },
    },
    fontFamily: { sans: ['"Plus Jakarta Sans"', '"Noto Sans"', 'system-ui', 'sans-serif'] },
    boxShadow: { soft: '0 6px 24px -10px rgba(29,43,107,.22)' },
  } },
}
