import type { DseConfig } from "../types.js";

export const pythonPreset: DseConfig = {
  preset: "recommended",
  targetDir: ".",
  include: ["**/*.{py,html,jinja,jinja2,css,tsx,jsx,js,ts}"],
  exclude: [
    "**/.venv/**",
    "**/venv/**",
    "**/__pycache__/**",
    "**/.pytest_cache/**",
    "**/.mypy_cache/**",
    "**/.git/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/*.egg-info/**",
  ],
  tokens: {
    typography: {
      minFontSize: "14px",
      maxFontSize: "32px",
      maxFontWeight: 500,
      disallowArbitrarySizes: true,
      disallowUppercase: true,
      allowXsOn: [],
    },
    geometry: {
      maxControlHeight: 36,
      allowedRadii: ["0px", "8px", "12px", "16px", "9999px"],
    },
    colors: {
      disallowRawHex: true,
      disallowButtonChipColors: true,
    },
  },
  components: {
    disallowRawHtml: {},
    requiredInventory: [],
  },
  rules: {
    "font-size-min": "error",
    "font-size-max": "error",
    "font-weight-max": "error",
    "no-uppercase-text": "warn",
    "no-raw-hex-colors": "off",
    "no-text-arrows": "error",
    "no-backdrop-blur": "error",
    "table-resizable-required": "off",
    "table-head-icon-required": "off",
    "table-single-border": "off",
    "table-no-divide-y": "off",
    "table-uniform-typography": "off",
    "table-no-cell-stacking": "off",
    "table-no-horizontal-stacking": "off",
    "table-windowed-pagination": "off",
    "tabs-component-required": "off",
    "component-inventory-active": "off",
  },
};

