/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c2d0ff',
          300: '#9db0ff',
          400: '#7585fc',
          500: '#5a63f6',
          600: '#4646eb',
          700: '#3836cf',
          800: '#2f2fa7',
          900: '#2c2d84',
        },
      },
    },
  },
  plugins: [],
};