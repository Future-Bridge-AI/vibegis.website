/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fiesta: {
          turquoise: '#00D9D5',
          pink: '#FF006E',
          orange: '#FF6B35',
        },
      },
      fontFamily: {
        sans: ['Orbitron', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'glow-turquoise': '0 0 40px rgba(0, 217, 213, 0.6)',
        'glow-pink': '0 0 40px rgba(255, 0, 110, 0.6)',
        'glow-orange': '0 0 40px rgba(255, 107, 53, 0.6)',
      },
      animation: {
        'shimmer': 'shimmer 3s infinite',
        'scan': 'scan 8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
