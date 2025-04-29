module.exports = {
  darkMode: 'class', // 👈 Add this line
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB'
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669'
        },
        danger: {
          DEFAULT: '#EF4444',
          dark: '#DC2626'
        }
      }
    },
  },
  plugins: [],
}
