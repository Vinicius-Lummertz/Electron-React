/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#6d28d9', 'secondary': '#f0abfc', 'background': '#111827',
        'surface': '#1f2937', 'text-primary': '#f9fafb', 'text-secondary': '#d1d5db',
      },
    },
  },
  plugins: [],
}