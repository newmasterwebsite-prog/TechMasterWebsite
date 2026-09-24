/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: '#d4af37',      // Primary luxury gold
          lightgold: '#f5e3a5', // Champagne/light gold
          darkgold: '#aa7c11',  // Dark gold
          bg: '#050505',        // Super dark background
          card: '#0f0f12',      // Dark card base
          accent: '#18181b',    // Zinc 900 base
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.15)',
        'gold-glow-lg': '0 0 25px rgba(212, 175, 55, 0.25)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
}

