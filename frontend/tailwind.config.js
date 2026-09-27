/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Astrix Dark Palette
        night: "#0B0814",
        "night-deep": "#07050E",
        "night-light": "#130F26",
        "surface-card": "#15102A",
        "surface-elevated": "#1C1638",
        "surface-border": "#261E4E",
        "surface-border-light": "#3B2E75",
        "brand-violet": "#7C5CFC",
        "brand-purple": "#8E6CFF",
        "brand-lavender": "#BFA5FF",
        "brand-lavender-light": "#D9CCFF",
        "text-main": "#F3F2F8",
        "text-muted": "#9E97B8",
        "text-dim": "#6B638A",

        // Mapped aliases ensuring existing classes instantly inherit dark palette
        ink: "#F3F2F8",
        body: "#9E97B8",
        lavender: "rgba(124, 92, 252, 0.15)",
        surface: "#100C22",
      },
      fontFamily: {
        sans: ['"Urbanist"', "sans-serif"],
        heading: ['"Urbanist"', "sans-serif"],
        body: ['"Urbanist"', "sans-serif"],
        ticker: ['"Space Grotesk"', "sans-serif"],
        mono: ['"Space Grotesk"', "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7C5CFC 0%, #9E7FFF 100%)",
        "brand-gradient-hover": "linear-gradient(135deg, #8E6CFF 0%, #AF91FF 100%)",
        "night-radial": "radial-gradient(circle at 50% 0%, #20174A 0%, #0B0814 70%)",
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(124, 92, 252, 0.25)",
        "glow-md": "0 0 25px rgba(124, 92, 252, 0.4)",
        "card-dark": "0 8px 32px rgba(0, 0, 0, 0.45)",
        "2xs": "0 1px 2px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
