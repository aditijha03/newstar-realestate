/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8eaf2',
          100: '#c5c9df',
          200: '#9fa6cc',
          300: '#7983b8',
          400: '#5d68a9',
          500: '#404e9a',
          600: '#364389',
          700: '#293571',
          800: '#1d2759',
          900: '#0B1120',
          950: '#070c17',
        },
        gold: {
          50: '#fdf8ec',
          100: '#f9edce',
          200: '#f3d89e',
          300: '#ecc165',
          400: '#E6C97A',
          500: '#C9A84C',
          600: '#b8902f',
          700: '#9a7225',
          800: '#7d5b22',
          900: '#674b1f',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, rgba(11,17,32,0.92) 0%, rgba(11,17,32,0.65) 55%, rgba(11,17,32,0.15) 100%)',
        'overlay-dark': 'linear-gradient(180deg, rgba(11,17,32,0.4) 0%, rgba(11,17,32,0.7) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        'xs': '375px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.16)',
        'gold': '0 4px 20px rgba(201,168,76,0.3)',
        'navbar': '0 2px 20px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
