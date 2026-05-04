/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005f69',
          light: '#e0f2f4',
          dark: '#004a52',
          glow: '#00f2ff',
        },
        accent: '#7c4dff',
      },
      fontFamily: {
        main: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '40px',
      }
    },
  },
  plugins: [],
}
