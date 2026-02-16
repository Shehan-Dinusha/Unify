/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'unify-blue': '#2B8CEE',
        'unify-purple': '#6A3093',
        'unify-gray': '#94A3B8',
        'unify-dark-gray': '#1E293B', // slate-800 equivalent for referencing
        'unify-darker-gray': '#111827', // gray-900 equivalent
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
