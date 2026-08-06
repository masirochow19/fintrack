import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada en los colores de sistema de iOS (Human Interface Guidelines)
        ios: {
          blue: "#0A84FF",
          green: "#30D158",
          indigo: "#5E5CE6",
          orange: "#FF9F0A",
          pink: "#FF375F",
          purple: "#BF5AF2",
          red: "#FF453A",
          teal: "#64D2FF",
          yellow: "#FFD60A",
        },
        surface: {
          light: "#F2F2F7", // system background claro
          "light-elevated": "#FFFFFF",
          dark: "#000000", // system background oscuro
          "dark-elevated": "#1C1C1E",
        },
        border: {
          light: "rgba(60, 60, 67, 0.29)",
          dark: "rgba(84, 84, 88, 0.6)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "20px",
        sheet: "28px",
      },
      backdropBlur: {
        glass: "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
        "card-dark": "0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.4)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(16px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
