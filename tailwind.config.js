/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['Syne', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bakery: {
          cream: '#faf7f2',
          sand: '#f2eae1',
          gold: '#dfa255',
          crust: '#8b4513',
          dark: '#1e1815',
          charcoal: '#12100e'
        },
        polidori: {
          black: '#0a0908',
          card: '#161412',
          gold: '#d4af37',
          olive: '#4a5d4e',
          prosciutto: '#c25e5e',
          crema: '#f4ede4'
        },
        reyes: {
          dark: '#07090d',
          card: '#11151d',
          accent: '#ff334b',
          muted: '#8e9aa8',
          border: '#232a36'
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
