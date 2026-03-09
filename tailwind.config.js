/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0066CC",     // Royal Blue
        secondary: "#FF9900",   // Saffron
        success: "#22c55e",     // Green
        alert: "#ef4444",       // Red
        amber: "#f59e0b",       // Amber
        background: "#F9FAFB",  // Light Grey
      }
    },
  },
  plugins: [],
}