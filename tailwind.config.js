/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bubblegum: ['Bubblegum Sans', 'sans-serif'],
        boogaloo: ['Boogaloo']
      },
    },
  },
  plugins: [],
}