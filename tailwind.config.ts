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
          title: "#052B63",
          navyDark: "#021F4D",
          action: "#1F5FAE",
          actionHover: "#174C91",
          pageTop: "#F7FBFF",
          pageMid: "#EEF6FF",
          pageBottom: "#F8FBFF",
          tableHeader: "#F1F7FF",
          softBorder: "#D7E7F7",
          activeBorder: "#9FC4EA",
          textareaFill: "#FFFFFF",
          textareaBorder: "#D7E7F7",
          text: "#102A43",
          muted: "#5D6F86",
        },
      },
    },
  },
  plugins: [],
};

export default config;
