/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./mdx-content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        "hc-primary": "#E33750",
        "hc-secondary": "#FDEBED",
        "hc-blue": "#338EDA",
        "hc-green": "#33D6A6",
        "hc-primary-dull": "#8C2E37"
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ]
}
