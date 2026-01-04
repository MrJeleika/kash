const path = require('path');
const { colors } = require(path.join(
  // @ts-expect-error aboba
  __dirname,
  '../../packages/utils/colors.config.js'
));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [],
};
