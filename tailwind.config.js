/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom palette based on RGB(18, 110, 130) -> #126E82
        // Generated palette to maintain contrast ratios
        primary: {
          50: '#f1fafa',
          100: '#dcf3f5',
          200: '#bee5e9',
          300: '#90d1da',
          400: '#5bb5c3',
          500: '#3a97a9',
          600: '#126e82', // The requested base color
          700: '#135a6b',
          800: '#164a58',
          900: '#163e4a',
          950: '#0b2831',
        },
        secondary: '#D4AF37', // Gold
      },
      fontFamily: {
        serif: ['"Ma Shan Zheng"', '"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
