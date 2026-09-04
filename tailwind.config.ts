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
        // Brand palette — extracted from the AP logo asset
        // Magenta "P" #EC268F (display/icon use); AA-safe text/button variant #C9157A
        brand: {
          DEFAULT: "#EC268F",
          dark: "#C9157A", // AA-safe on white/cream/tint
          deep: "#A80F66", // hover / pressed
          tint: "#FDEBF4",
        },
        // Cyan "A" #00AFEF (decorative/icons); accessible deep variant for fills
        sky: {
          DEFAULT: "#00AFEF",
          deep: "#006A99", // AA-safe fill with white text (5.96:1)
          tint: "#E5F6FD",
        },
        ink: "#211A18",
        cream: "#FAF6F1",
        // Warm neutral derived from the logo's cream card family
        sand: "#F6EEE5",
        line: "#EADDD2", // warm border tone
        success: {
          DEFAULT: "#15803D",
          tint: "#EAF6EE",
        },
        danger: {
          DEFAULT: "#B91C1C",
          tint: "#FDECEC",
        },
        warning: {
          DEFAULT: "#B45309",
          tint: "#FCF3E3",
        },
        whatsapp: {
          DEFAULT: "#15803D", // AA-safe with white text (5.02:1), still WhatsApp-green
          deep: "#166534",
        },
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
