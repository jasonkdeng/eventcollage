/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        cream: "#FDF6EC",
        terracotta: "#E8825A",
        charcoal: "#2C2C2C",
        sage: "#A8B89A",
      },
      boxShadow: {
        polaroid: "0 14px 32px rgba(44, 44, 44, 0.16)",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "70%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeInUp: {
          "0%": { transform: "translateY(14px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "pop-in": "popIn 450ms cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in-up": "fadeInUp 600ms ease forwards",
      },
    },
  },
  plugins: [],
};
