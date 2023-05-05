/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  mode: "jit",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      transitionProperty: {
        height: "height",
      },
      minWidth: {
        96: "24rem",
      },
      maxHeight: {
        100: "40rem",
      },
      spacing: {
        66: "16.5rem",
        76: "19rem",
        120: "30rem",
      },
      aspectRatio: {
        "1/1.5": "1.5 / 1",
      },
      screens: {
        "3xl": "1910px",
      },
      inset: {
        "1px": "1px",
      },
    },
  },

  plugins: [],
};
