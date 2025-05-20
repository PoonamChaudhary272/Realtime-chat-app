/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary-color))',
        secondary: 'rgb(var(--secondary-color))',
        accent: 'rgb(var(--accent-color))',
        success: 'rgb(var(--success-color))',
        warning: 'rgb(var(--warning-color))',
        error: 'rgb(var(--error-color))',
        background: 'rgb(var(--background-color))',
        surface: 'rgb(var(--surface-color))',
        'text-primary': 'rgb(var(--text-primary))',
        'text-secondary': 'rgb(var(--text-secondary))',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxHeight: {
        '128': '32rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};