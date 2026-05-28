import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    /** Journal glass tokens (`JOURNAL_GLASS_*`) live here — must be scanned or utilities are purged */
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "ui-serif", "serif"],
      },
      colors: {
        bvm: {
          title: "oklch(var(--bvm-primary) / <alpha-value>)",
          accent: "oklch(var(--bvm-accent) / <alpha-value>)",
          action: "oklch(var(--bvm-action) / <alpha-value>)",
          actionHover: "oklch(var(--bvm-action-hover) / <alpha-value>)",
          softBlue: "oklch(var(--bvm-soft-blue) / <alpha-value>)",
          pageTop: "oklch(var(--bvm-page-top) / <alpha-value>)",
          pageMid: "oklch(var(--bvm-page-mid) / <alpha-value>)",
          pageBottom: "oklch(var(--bvm-page-bottom) / <alpha-value>)",
          surface: "oklch(var(--bvm-surface) / <alpha-value>)",
          fg: "oklch(var(--bvm-fg) / <alpha-value>)",
          muted: "oklch(var(--bvm-muted) / <alpha-value>)",
          border: "oklch(var(--bvm-border) / <alpha-value>)",
          borderStrong: "oklch(var(--bvm-border-strong) / <alpha-value>)",
          success: "oklch(var(--bvm-success) / <alpha-value>)",
          warning: "oklch(var(--bvm-warning) / <alpha-value>)",
          tableHeader: "oklch(var(--bvm-table-header) / <alpha-value>)",
          textareaFill: "oklch(var(--bvm-textarea-fill) / <alpha-value>)",
          textareaBorder: "oklch(var(--bvm-textarea-border) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
