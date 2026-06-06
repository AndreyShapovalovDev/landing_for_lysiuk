import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      colors: {
        ivory: "#f8f5f0",
        charcoal: "#1a1a1a",
        warm: {
          50: "#faf8f5",
          100: "#f2ede6",
          200: "#e8dfd4",
          300: "#d4c8b8",
          400: "#b8a898",
          500: "#9a8878",
        },
      },
      letterSpacing: {
        widest: "0.35em",
        "ultra-wide": "0.5em",
      },
      animation: {
        "fade-up": "fadeUp 1.2s ease forwards",
        "fade-in": "fadeIn 1.5s ease forwards",
        "line-grow": "lineGrow 1.5s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        lineGrow: {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "100%": { transform: "scaleY(1)", transformOrigin: "top" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
