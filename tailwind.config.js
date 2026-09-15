/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        eco: {
          lime: "#B6F022",
          vivid: "#64B60A",
          forest: "#01520F",
          teal: "#075F6F",
          bgLight: "#EFF0EB",
          bgDark: "#191F1C",
          cardDark: "#222A25",
          cardDarkElevated: "#29322D",
          charcoal: "#1D1D1D",
        },
      },
      borderRadius: {
        pill: "9999px",
        box: "24px",
      },
    },
  },
};
