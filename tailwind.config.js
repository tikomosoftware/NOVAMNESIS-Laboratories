/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#060711",
        graphite: "#0c1020",
        cyanline: "#58f4ff",
        violetsignal: "#9d6dff",
        magentapulse: "#ff4fd8",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans JP",
          "Hiragino Sans",
          "Yu Gothic UI",
          "Meiryo",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 36px rgba(88, 244, 255, 0.22)",
        magenta: "0 0 42px rgba(255, 79, 216, 0.18)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "20%, 70%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        scan: "scan 5.5s ease-in-out infinite",
        fadeIn: "fadeIn 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};
