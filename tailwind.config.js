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
        geodark: {
          DEFAULT: '#0a0e17',
          secondary: '#1a1f2e',
          tertiary: '#0f1419',
        },
        wizard: {
          bg: '#0a0e17',
          card: '#1a1f2e',
          border: '#334155',
          accent: '#00ffff',
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
        'wizard-card': '0 20px 80px rgba(8, 15, 32, 0.6)',
        'wizard-glow': '0 0 30px rgba(0, 217, 213, 0.3)',
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
