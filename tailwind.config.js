/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blueprint Paper Palette
        paper: {
          DEFAULT: '#f8f6f1',
          warm: '#faf8f3',
          cool: '#f5f5f5',
          grid: '#e8e5df',
        },
        ink: {
          DEFAULT: '#1a1a2e',
          light: '#4a4a5a',
          faint: '#8a8a9a',
          muted: '#b8b8c8',
        },
        accent: {
          blue: '#2563eb',
          'blue-light': '#dbeafe',
          'blue-dark': '#1d4ed8',
          red: '#dc2626',
          'red-light': '#fee2e2',
          'red-dark': '#b91c1c',
        },
        border: {
          DEFAULT: '#d1cfc8',
          dark: '#a8a598',
          light: '#e8e5df',
        },
        // Semantic tokens for wizard
        wizard: {
          bg: '#f8f6f1',
          card: '#ffffff',
          border: '#d1cfc8',
          accent: '#2563eb',
        },
        // Legacy aliases (for gradual migration)
        fiesta: {
          turquoise: '#2563eb', // Map to blue accent
          pink: '#dc2626',      // Map to red accent
          orange: '#ea580c',    // Keep for warnings
        },
        geodark: {
          DEFAULT: '#f8f6f1',   // Invert to paper
          secondary: '#ffffff', // Invert to white
          tertiary: '#faf8f3',  // Invert to warm paper
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1)',
        'card-lg': '0 8px 24px rgba(0,0,0,0.12)',
        'inner-subtle': 'inset 0 1px 2px rgba(0,0,0,0.05)',
        // Legacy aliases
        'wizard-card': '0 1px 3px rgba(0,0,0,0.08)',
        'wizard-glow': '0 4px 12px rgba(37,99,235,0.15)',
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(to right, var(--tw-gradient-stops)),
          linear-gradient(to bottom, var(--tw-gradient-stops))
        `,
      },
    },
  },
  plugins: [],
}
