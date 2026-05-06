/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stronghold: {
          red:       '#C0392B',
          darkred:   '#8B1A1A',
          black:     '#1A1A1A',
          cream:     '#E8E4DC',
          gray:      '#6B6B6B',
          lightgray: '#F2F0EC',
          gold:      '#D4A017',
          white:     '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: []
}

