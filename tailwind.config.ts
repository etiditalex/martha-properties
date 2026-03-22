import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        martha: {
          black: "#1a1a1a",
          charcoal: "#2d2d2d",
          warm: "#b8860b",
          cream: "#f8f6f3",
          sand: "#e8e4df",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-geist-mono)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
