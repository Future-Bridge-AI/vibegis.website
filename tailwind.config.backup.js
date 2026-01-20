/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GeoPunk Brand Colors
        geodark: {
          DEFAULT: '#0a0e17',      // Primary dark navy background
          secondary: '#1a1f2e',    // Card backgrounds
          tertiary: '#0f1419',     // Deeper dark for gradients
        },
        neon: {
          cyan: {
            DEFAULT: '#00ffff',    // Primary cyan
            400: '#22d3ee',        // Tailwind cyan-400 equivalent
            500: '#06b6d4',        // Tailwind cyan-500 equivalent
          },
          purple: {
            DEFAULT: '#8b5cf6',    // Primary purple
            500: '#a855f7',        // Tailwind purple-500
            600: '#9333ea',        // Tailwind purple-600
          },
          pink: {
            DEFAULT: '#ec4899',    // Primary pink
            500: '#ec4899',        // Tailwind pink-500
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-cyan': `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'neon-cyan-lg': '0 0 30px rgba(0, 255, 255, 0.5)',
        'neon-cyan-xl': '0 0 40px rgba(0, 255, 255, 0.6)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
