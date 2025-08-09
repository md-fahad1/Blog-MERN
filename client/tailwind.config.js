/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fenix: ["Fenix", "serif"], // JS array, not CSS syntax
        merienda: ["Merienda", "cursive"],
        mrdafoe: ["Mr Dafoe", "cursive"],
        arizonia: ["Arizonia", "cursive"],
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};
