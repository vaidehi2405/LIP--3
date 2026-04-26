import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./AppReviewDashboard.tsx"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
