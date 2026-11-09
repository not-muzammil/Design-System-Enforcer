import type { DseConfig } from "../types.js";

export const defaultPreset: DseConfig = {
  preset: "recommended",
  targetDir: "src",
  include: ["**/*.{tsx,jsx,ts,js}"],
  exclude: [
    "**/node_modules/**",
    "**/.next/**",
    "**/public/**",
    "**/.git/**",
    "**/dist/**",
  ],
  tokens: {
    typography: {
      minFontSize: "13px",
      maxFontSize: "36px",
      maxFontWeight: 600,
      disallowArbitrarySizes: false,
      disallowUppercase: true,
      allowXsOn: [],
    },
    geometry: {
      maxControlHeight: 40,
      minControlHeight: 32,
      chipHeight: 28,
      minIconSize: 16,
      allowedRadii: ["0", "0px", "4px", "6px", "8px", "12px", "16px", "9999px", "100%"],
    },
    colors: {
      disallowRawHex: false,
      disallowButtonChipColors: true,
    },
  },
  components: {
    disallowRawHtml: {
      button: { replaceWith: "Button", importFrom: "@/components/ui/button", checkRawElement: true },
      select: { replaceWith: "Dropdown", importFrom: "@/components/ui/dropdown", checkRawElement: true },
      textarea: { replaceWith: "Textarea", importFrom: "@/components/ui/textarea", checkRawElement: true },
      progress: { replaceWith: "ProgressBar", importFrom: "@/components/ui/progress", checkRawElement: true },
      dialog: { replaceWith: "Modal or Dialog", importFrom: "@/components/ui/modal", checkRawElement: true },
    },
    disallowPseudoChips: true,
  },
  rules: {
    "font-size-min": "error",
    "no-uppercase-text": "warn",
    "no-raw-html-elements": "error",
    "no-pseudo-chips": "warn",
    "no-chip-colored-buttons": "error",
    "no-text-arrows": "error",
    "no-backdrop-blur": "warn",
    "no-wrapping-compact-elements": "warn",
    "no-primitive-geometry-overrides": "error",
    "no-primitive-style-overrides": "error",
    "icon-size-min": "error",
  },
};
