/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1565C0', light: '#1976D2', lighter: '#E3F2FD', dark: '#0D47A1' },
        success: { DEFAULT: '#2E7D32', light: '#388E3C', lighter: '#E8F5E9' },
        danger: { DEFAULT: '#C62828', light: '#E53935', lighter: '#FFEBEE' },
        teal: { DEFAULT: '#00796B', lighter: '#E0F2F1' },
        amber: { DEFAULT: '#F59E0B', lighter: '#FFF8E1' },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(21,101,192,0.10)',
        'card-hover': '0 8px 40px rgba(21,101,192,0.15)',
        glow: '0 0 30px rgba(21,101,192,0.25)',
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease both',
      },
      keyframes: {
        'pulse-dot': {
          '0%,100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.3)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(18px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
