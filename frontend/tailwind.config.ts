import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        'soft': "0 2px 10px rgba(0,0,0,0.06)",
        'elev': "0 8px 30px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
} satisfies Config
