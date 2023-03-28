/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./charts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5c6ac4',
        secondary: '#ecc94b',
        ups: '#00C800',
        downs: '#C80000'
      },
      textColor: {
        significant: '#dddddd',
        primary: '#98989d',
        secondary: '#595959',
      },
      backgroundColor: {
        primary: '#1d1d1d',
        secondary: '#282627',
        active: '#404042'
      },
      borderColor: {
        default: '#404042',
      }
    },
  },
  plugins: [],
}
