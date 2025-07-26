export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pureblack: '#0a0a0a',
        darkgray: '#23272a',
        midgray: '#2c2f33',
        lightgray: '#99aab5',
      },
      fontSize: {
        base: '1.15rem', // default is 1rem, increase to 1.15rem
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
} 