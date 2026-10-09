/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b2545',
          blue: '#134074',
          accent: '#0066cc',
          gold: '#c59b27',
          light: '#eef4f8',
          border: '#d0dbe5'
        }
      }
    },
  },
  plugins: [],
}
