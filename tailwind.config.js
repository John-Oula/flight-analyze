/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['IBM Plex Mono', 'monospace'],
        'sans': ['IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        'dark': {
          'bg': '#0A0A0A',
          'surface': '#1A1A1A',
          'surface-light': '#2A2A2A',
          'border': '#555555',
          'text': '#FFFFFF',
          'text-secondary': '#A0A0A0',
          'text-muted': '#666666',
        },
        'accent': {
          'primary': '#3B82F6',
          'secondary': '#8B5CF6',
          'success': '#10B981',
          'warning': '#F59E0B',
          'error': '#EF4444',
          'info': '#06B6D4',
        },
        'chart': {
          'blue': '#3B82F6',
          'green': '#10B981',
          'yellow': '#F59E0B',
          'red': '#EF4444',
          'purple': '#8B5CF6',
          'cyan': '#06B6D4',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'military-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23FF6B35\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #FF6B35' },
          '100%': { boxShadow: '0 0 20px #FF6B35, 0 0 30px #FF6B35' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      boxShadow: {
        'military': '0 0 20px rgba(255, 107, 53, 0.3)',
        'military-glow': '0 0 30px rgba(255, 107, 53, 0.5)',
      }
    },
  },
  plugins: [],
}