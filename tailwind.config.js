/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          50:  "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        bluey: {
          soft:   "#cce8ff",
          mid:    "#5ab4f5",
          deep:   "#1e6fbf",
          bubble: "rgba(200,232,255,0.35)",
          glass:  "rgba(14,80,160,0.25)",
        },
      },
      fontFamily: {
        sans:    ["Nunito", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "ui-sans-serif"],
      },
      animation: {
        "float-slow":   "float 6s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        "pulse-glow":   "pulseGlow 3s ease-in-out infinite",
        "slide-up":     "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":      "fadeIn 0.4s ease both",
        "bounce-in":    "bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        "spin-slow":    "spin 8s linear infinite",
        "bubble-pop":   "bubblePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(90,180,245,0.4)" },
          "50%":      { boxShadow: "0 0 50px rgba(90,180,245,0.8), 0 0 80px rgba(90,180,245,0.3)" },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(30px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        bounceIn: {
          from: { opacity: 0, transform: "scale(0.7)" },
          to:   { opacity: 1, transform: "scale(1)" },
        },
        bubblePop: {
          from: { opacity: 0, transform: "scale(0.8) translateY(20px)" },
          to:   { opacity: 1, transform: "scale(1) translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        bubble: "0 8px 32px rgba(14,80,160,0.18), 0 2px 8px rgba(90,180,245,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
        "bubble-hover": "0 16px 48px rgba(14,80,160,0.28), 0 4px 16px rgba(90,180,245,0.2), inset 0 1px 0 rgba(255,255,255,0.5)",
        glow: "0 0 30px rgba(90,180,245,0.5)",
      },
    },
  },
  plugins: [],
};
