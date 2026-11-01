/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07040d',
          900: '#0f081d',
          850: '#150c29',
          800: '#1c1037',
          700: '#2a1852',
          600: '#3d2475'
        },
        purple: {
          glow: '#A855F7',
          deep: '#581C87',
          accent: '#7C3AED',
          light: '#C084FC'
        },
        navy: {
          DEFAULT: '#1D2B6B',
          800: '#16205A',
          600: '#4A5A9E',
          200: '#CBD3F0',
          100: '#E4E9FA',
          50: '#F1F4FD'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(124, 58, 237, 0.18)',
        'glass-hover': '0 12px 40px 0 rgba(168, 85, 247, 0.3)',
        orb: '0 0 60px rgba(168, 85, 247, 0.4), 0 0 100px rgba(56, 189, 248, 0.2)'
      },
      backgroundImage: {
        'dark-mesh': 'radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.15), transparent 45%), radial-gradient(circle at 90% 10%, rgba(56, 189, 248, 0.12), transparent 40%), radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.1), transparent 50%)'
      }
    }
  },
  plugins: []
}
