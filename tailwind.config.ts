import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Microsoft Fluent 2 Design Tokens (mapped to CSS variables for dynamic dark/light switching)
        fluent: {
          // Brand
          "brand-primary": "var(--fluent-brand-primary)",
          "brand-hover": "var(--fluent-brand-hover)",
          "brand-pressed": "var(--fluent-brand-pressed)",
          "brand-light": "var(--fluent-brand-light)",
          // Neutral Surfaces
          "neutral-bg": "var(--fluent-neutral-bg)",
          "neutral-bg-2": "var(--fluent-neutral-bg-2)",
          "neutral-bg-3": "var(--fluent-neutral-bg-3)",
          "neutral-bg-4": "var(--fluent-neutral-bg-4)",
          // Strokes / Borders
          "neutral-stroke": "var(--fluent-neutral-stroke)",
          "neutral-stroke-2": "var(--fluent-neutral-stroke-2)",
          "neutral-stroke-3": "var(--fluent-neutral-stroke-3)",
          // Text
          "text-primary": "var(--fluent-text-primary)",
          "text-secondary": "var(--fluent-text-secondary)",
          "text-tertiary": "var(--fluent-text-tertiary)",
          "text-disabled": "var(--fluent-text-disabled)",
          // Status: ORDERED
          "status-ordered-bg": "var(--fluent-status-ordered-bg)",
          "status-ordered-fg": "var(--fluent-status-ordered-fg)",
          "status-ordered-border": "#FADA83",
          // Status: READY
          "status-ready-bg": "var(--fluent-status-ready-bg)",
          "status-ready-fg": "var(--fluent-status-ready-fg)",
          "status-ready-border": "#82C978",
          // Status: DELIVERED
          "status-delivered-bg": "var(--fluent-status-delivered-bg)",
          "status-delivered-fg": "var(--fluent-status-delivered-fg)",
          "status-delivered-border": "#83BFEC",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Fluent 2 radius scale
        "fluent-sm": "4px",
        "fluent-md": "6px",
        "fluent-lg": "8px",
        "fluent-xl": "12px",
      },
      boxShadow: {
        "fluent-2": "0 2px 4px 0 rgba(0, 0, 0, 0.08)",
        "fluent-4": "0 4px 8px 0 rgba(0, 0, 0, 0.10)",
        "fluent-8": "0 8px 16px 0 rgba(0, 0, 0, 0.12)",
        "fluent-16": "0 16px 32px 0 rgba(0, 0, 0, 0.14)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.25s ease-out",
        "fade-in": "fade-in 0.2s ease-in",
      },
    },
  },
  plugins: [animate],
};

export default config;
