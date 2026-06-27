import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#050505",
        surface: "#141414",
        surface2: "#181818",
        line: "#2A2A2A",
        muted: "#A3A3A3",
        violet: "#7C3AED",
        electric: "#2563EB",
        magenta: "#D946EF"
      },
      boxShadow: {
        glow: "0 20px 70px rgba(124, 58, 237, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
