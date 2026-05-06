import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hn: {
          orange: "#ff6600",
          bg: "#f6f6ef",
          subtext: "#828282",
        },
      },
      fontFamily: {
        sans: ["Verdana", "Geneva", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
