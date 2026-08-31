import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#211A18",
        cream: "#FAF6F1",
        rose: "#A64D5C",
        sand: "#E9DED3",
        gold: "#B58A4B",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        soft: "0 14px 40px rgba(33, 26, 24, 0.08)",
        medium: "0 8px 30px rgba(33, 26, 24, 0.12)",
      },
      borderRadius: {
        "2xl": "1.4rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
