/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-void': '#0c0517',
        'bg-nebula': '#1c0e33',
        'accent-primary': '#8b5cf6',
        'accent-orchid': '#c084fc',
        'accent-blush': '#f0abfc',
        'text-primary': '#f5f0ff',
        'text-muted': '#a393c2',
        'line-glow': '#a78bfa',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        cinzel: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'], // Graceful modern upgrade for any remaining references
      },
    },
  },
  plugins: [],
}
