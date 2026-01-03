/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff'
        },
        indigo: {
          500: '#6366f1'
        },
        emerald: {
          500: '#10b981'
        }
      }
    }
  },
  plugins: []
};
