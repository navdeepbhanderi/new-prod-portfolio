import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        // Wide enough that 1920px screens don't feel like a centered column;
        // container-px padding still protects laptops.
        container: "1400px",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        "fluid-hero": "clamp(2.75rem, 8vw, 7rem)",
        "fluid-h2": "clamp(2rem, 5vw, 3.75rem)",
        "fluid-h3": "clamp(1.5rem, 3vw, 2.25rem)",
        "fluid-lead": "clamp(1.05rem, 2vw, 1.375rem)",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
