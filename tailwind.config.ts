import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        math: {
          axiom: "#8b5cf6",
          definition: "#3b82f6",
          lemma: "#06b6d4",
          theorem: "#10b981",
          corollary: "#14b8a6",
          property: "#6366f1",
          example: "#f59e0b",
          counterexample: "#ef4444",
          conjecture: "#ec4899",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cambria", "Times New Roman", "serif"],
        mono: ["var(--font-mono)", "Fira Code", "Courier New", "monospace"],
      }
    },
  },
  plugins: [],
} satisfies Config;
