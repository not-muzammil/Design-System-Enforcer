export const tokensTemplate = `/**
 * Design System Tokens
 * All colors are driven by CSS variables in HSL format for instant theme customization.
 * AI Agents or developers can update these values in globals.css.
 */

export const typographyTokens = {
  fontFamily: {
    sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
    mono: ["var(--font-mono)", "monospace"],
  },
  fontSize: {
    xs: "12px",
    sm: "14px", // Primary body font standard
    base: "16px", // Large body font
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px", // Maximum heading cap
  },
  fontWeight: {
    regular: "400",
    medium: "500", // Standard for buttons and interactive controls
    semibold: "600",
  },
  lineHeight: {
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
  },
} as const;

export const geometryTokens = {
  radius: {
    none: "0px",
    checkbox: "4px", // Strictly 4px for checkboxes only
    sm: "8px",
    md: "8px", // Standard for buttons, inputs, dropdowns, tabs
    lg: "12px", // Standard for cards and modal containers
    xl: "16px",
    full: "9999px",
  },
  controlHeight: {
    sm: "30px",
    md: "36px", // Standard control height (buttons, inputs, tabs)
    lg: "40px",
  },
  checkboxSize: "20px", // Standard size-5
} as const;
`;

