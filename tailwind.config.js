/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1C1917',
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          600: '#4338CA',
          700: '#312E81',
          900: '#1E1B4B',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        amber: {
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        violet: {
          500: '#8B5CF6',
        },
        cream: '#FDFBF7',
        paper: '#FFFFFF',
        muted: '#57534E',
        line: '#E7E5E4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        rest: '0 1px 2px rgba(28, 25, 23, 0.05), 0 4px 12px -2px rgba(28, 25, 23, 0.04)',
        raise: '0 2px 4px rgba(28, 25, 23, 0.06), 0 12px 28px -6px rgba(28, 25, 23, 0.12)',
        float: '0 4px 8px rgba(28, 25, 23, 0.08), 0 24px 48px -12px rgba(28, 25, 23, 0.20)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}
