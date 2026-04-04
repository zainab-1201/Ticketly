/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "tk-bg": "var(--tk-bg)",
        "tk-card": "var(--tk-card)",
        "tk-dark": "var(--tk-dark)",
        "tk-text": "var(--tk-text)",
        "tk-muted": "var(--tk-muted)",
        "tk-border": "var(--tk-border)",
        "tk-gold": "var(--tk-gold)",
        "tk-orange": "var(--tk-orange)",
        "tk-black": "#0a0c10",
      },
      fontFamily: {
        display: ["Oswald", "Bebas Neue", "sans-serif"],
        body: ["Manrope", "Segoe UI", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 197, 97, 0.2)" },
          "50%": { boxShadow: "0 0 0 14px rgba(255, 197, 97, 0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};
