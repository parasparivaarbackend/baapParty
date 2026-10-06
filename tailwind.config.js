/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './data/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF6EC',
        paper: '#F5EEDD',
        ink: '#14213D',
        'ink-soft': '#2A3654',
        saffron: {
          DEFAULT: '#E85D2C',
          light: '#F3835C',
          dark: '#C7481D',
        },
        marigold: {
          DEFAULT: '#F4A300',
          light: '#FFC94D',
        },
        banyan: {
          DEFAULT: '#0B6E4F',
          light: '#12915F',
          dark: '#084D38',
        },
        chakra: '#1D3E82',
      },
      fontFamily: {
        display: ['var(--font-baloo)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-space)', 'monospace'],
      },
      backgroundImage: {
        'tricolor-thread': 'linear-gradient(90deg, #E85D2C 0%, #E85D2C 33%, #FBF6EC 33%, #FBF6EC 66%, #0B6E4F 66%, #0B6E4F 100%)',
        'sunburst': 'radial-gradient(circle at 50% 30%, rgba(244,163,0,0.35), rgba(244,163,0,0) 60%)',
      },
      boxShadow: {
        card: '0 12px 40px -12px rgba(20,33,61,0.25)',
        'card-hover': '0 20px 50px -14px rgba(20,33,61,0.35)',
      },
      animation: {
        'flag-wave': 'flagWave 6s ease-in-out infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
        'spin-slow': 'spin 14s linear infinite',
      },
      keyframes: {
        flagWave: {
          '0%, 100%': { transform: 'skewY(0deg)' },
          '50%': { transform: 'skewY(1deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
