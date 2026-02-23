/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          blue: "#2B8CEE", // rgba(43, 140, 238, 1)
          light: "rgba(43, 140, 238, 0.2)",
          accent: "#6A3093", // rgba(106, 48, 147, 1)
        },
        dark: {
          1: "#0D1A26",
          2: "#12283E",
          3: "#101922",
          4: "#18232F",
          5: "linear-gradient(180deg, #0D1A26 0%, #12283E 100%)",
        },
        text: {
          primary: "#FFFFFF",
          soft: "#F5F5F7",
          secondary: "#9CA3AF",
          tertiary: "#A1A1A6",
        },
        state: {
          info: "#2666F1",
          warning: "#FBBF24",
          success: "#4ADE80",
          error: "#FF6366",
        },
      },
      boxShadow: {
        "custom-shadow": "0px 8px 32px rgba(31, 38, 135, 0.4)",
      },
      backgroundImage: {
        "app-bg": "linear-gradient(180deg, #0D1A26 0%, #12283E 100%)",
      },
      fontSize: {
        // [font-size, { line-height, letter-spacing, font-weight }]
        "heading-display": [
          "72px",
          { lineHeight: "72px", letterSpacing: "-0.0238em", fontWeight: "900" },
        ],
        "heading-large": [
          "48px",
          { lineHeight: "25px", letterSpacing: "-0.003em", fontWeight: "700" },
        ],
        "heading-medium": [
          "30px",
          { lineHeight: "36px", letterSpacing: "-0.0075em", fontWeight: "700" },
        ],
        "heading-small": [
          "24px",
          { lineHeight: "32px", letterSpacing: "-0.006em", fontWeight: "700" },
        ],
        "body-large": [
          "20px",
          { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" },
        ],
        "body-large-bold": [
          "20px",
          { lineHeight: "20px", letterSpacing: "0em", fontWeight: "700" },
        ],
        "body-medium": [
          "16px",
          { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" },
        ],
        "body-medium-bold": [
          "16px",
          { lineHeight: "20px", letterSpacing: "0em", fontWeight: "700" },
        ],
        "body-small": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" },
        ],
        "body-small-bold": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0em", fontWeight: "700" },
        ],
        "body-extra-small": [
          "12px",
          { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" },
        ],
        "body-extra-small-bold": [
          "12px",
          { lineHeight: "20px", letterSpacing: "0em", fontWeight: "700" },
        ],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "40px",
        "3xl": "48px",
        "4xl": "64px",
      },
    },
  },
  plugins: [],
};
