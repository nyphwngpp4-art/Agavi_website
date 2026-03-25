import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#020913",
        bg2: "#071223",
        panel: "#091627",
        panel2: "#0c1b2e",
        teal: "#5ef6ee",
        cyan: "#57d6ff",
        blue: "#6d91ff",
        gold: "#f0c26e",
        green: "#9be784",
        muted: "#aab8c8",
        surface: "#eef6ff",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },
      borderRadius: {
        panel: "22px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(109,145,255,.16), 0 16px 44px rgba(0,0,0,.32)",
        card: "0 22px 60px rgba(0,0,0,.35)",
      },
    },
  },
  plugins: [],
};

export default config;
