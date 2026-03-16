/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E4FA3",
        secondary: "#2ECC71",
        background: "#F5F7FB",
        card: "#FFFFFF",
        text: "#1A1A1A",
        success: "#22c55e",
        alert: "#ef4444",
        "light-grey": "#F9FAFB",
      }
    },
  },
  plugins: [],
}