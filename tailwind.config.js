/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
    './src/**/*.js',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff5900',
      }
    },
  },
  plugins: [],
}
