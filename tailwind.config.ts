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
        // Microsoft Fluent 2 Light Theme Tokens
        fluent: {
          // Brand
          "brand-primary": "#0078D4",
          "brand-hover": "#106EBE",
          "brand-pressed": "#005A9E",
          "brand-light": "#EFF6FC",
          // Neutral Surfaces
          "neutral-bg": "#FFFFFF",
          "neutral-bg-2": "#FAFAFA",
          "neutral-bg-3": "#F5F5F5",
          "neutral-bg-4": "#F0F0F0",
          // Strokes / Borders
          "neutral-stroke": "#E0E0E0",
          "neutral-stroke-2": "#C8C8C8",
          "neutral-stroke-3": "#ADADAD",
          // Text
          "text-primary": "#242424",
          "text-secondary": "#616161",
          "text-tertiary": "#8A8886",
          "text-disabled": "#BDBDBD",
          // Status: ORDERED
          "status-ordered-bg": "#FFF4CE",
          "status-ordered-fg": "#835C00",
          "status-ordered-border": "#FADA83",
          // Status: READY
          "status-ready-bg": "#DFF6DD",
          "status-ready-fg": "#107C10",
          "status-ready-border": "#82C978",
          // Status: DELIVERED
          "status-delivered-bg": "#DEECF9",
          "status-delivered-fg": "#0078D4",
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
