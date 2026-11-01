# Design System Enforcer (DSE) 🛡️

> **Zero-compromise Design System Enforcer, AST Linter & Primitive Scaffolder for React, Next.js, and Tailwind projects.**

Traditional linters (ESLint, Prettier, Stylelint) check code formatting and basic syntax, but they have zero awareness of **visual design systems**. They allow developers and AI agents to accidentally introduce:
- Random font sizes (`text-[13px]`, `text-xs`) that break vertical rhythm.
- Heavy font weights (`font-bold`, `font-semibold`) where medium (500) is standard.
- Raw HTML primitives (`<button>`, `<select>`, `<table>`) bypassing official design system components.
- Buttons styled like status badges with dangerous green/red colors (`NO_CHIP_COLORED_BUTTONS`).
- Double table borders, missing resize dividers, missing column header icons, or vertical text stacking in table cells.
- Raw ASCII arrows (`->`, `=>`, `→`) instead of standard icon components.
- Heavy backdrop blurs breaking crisp contrast standards.

**DSE stops design drift at the AST level**, crashing builds, pre-commit checks, or dev servers whenever a violation is committed.

---

## ⚡ Quick Start

### 1. Install

```bash
npm install -D design-system-enforcer
# or
pnpm add -D design-system-enforcer
```

### 2. Initialize in Your Project

```bash
npx dse init
```

This interactive command:
- Generates `dse.config.js` with sensible defaults.
- Adds `"dse": "dse"` script to your `package.json`.
- Detects if you have primitives and offers to scaffold them.

### 3. Run the Check

```bash
npm run dse
# or
npx dse check
```

---

## 🎨 Theme Customization with AI Agents

When DSE scaffolds primitives and tokens (`npx dse scaffold`), all colors are powered by **standard CSS variables in HSL format**:

```css
/* src/app/globals.css */
:root {
  --background: 0 0% 100%;       /* White */
  --foreground: 0 0% 11%;        /* Neutral 900 */
  --primary: 0 0% 9%;            /* Dark neutral */
  --border: 0 0% 90%;            /* Border stroke */
  --radius-md: 8px;              /* Standard controls */
  --radius-lg: 12px;             /* Standard cards */
}
```

### Want to change the theme or palette?
Simply instruct your AI assistant:
> *"Change the primary brand color to ocean blue and use slightly rounded borders."*

The AI assistant simply updates the HSL values in `globals.css` or `tokens.ts`. **DSE protects the structure, typography, component hierarchies, and invariants**, while allowing 100% aesthetic flexibility!

---

## 🧩 Scaffolding Primitives (`dse add` & `dse scaffold`)

If your project doesn't have design system components yet, DSE can scaffold production-ready, accessible, 100% compliant primitives:

```bash
# Scaffold all primitives + tokens + globals.css:
npx dse scaffold

# Or add individual components on demand:
npx dse add button chip input dropdown table tabs card checkbox skeleton
```

Generated components include:
- `<Button />`: Standard 36px height (`h-[36px] min-h-[36px]`), 8px radius (`rounded-md`), strictly font-weight medium (500), standard neutral variants (`primary`, `outline`, `secondary`, `ghost`), bans chip colors.
- `<Chip />`: Standard 36px height, 8px radius status pills (`neutral`, `success`, `warning`, `error`).
- `<Input />`: Standard 36px height, 8px radius, standard 14px typography.
- `<Dropdown />`: Accessible custom dropdown replacing browser default `<select>`.
- `<Table />`: Suite with resizable columns, icon support in `<TableHead>`, single border (no double stroke), no divide-y, and windowed pagination.
- `<Tabs />`: Standard 36px height, 8px radius, with mandatory `items` prop.
- `<Checkbox />`: Strictly 20px (`size-5`) with 4px corner radius (`rounded-xs`).
- `<Card />`: Strictly 12px corner radius (`rounded-lg`) for content containers.

---

## ⚙️ Configuration (`dse.config.js`)

```javascript
import { defineConfig } from "design-system-enforcer";

export default defineConfig({
  preset: "berserk", // "berserk" | "recommended" | "minimal"
  targetDir: "src",
  include: ["**/*.{tsx,jsx,ts,js}"],
  exclude: [
    "**/node_modules/**",
    "**/.next/**",
    "src/components/ui/button.tsx", // exempt base primitive files
  ],
  tokens: {
    typography: {
      minFontSize: "14px",          // Bans text-xs, text-[12px]
      maxFontSize: "32px",          // Bans text-3xl, text-4xl
      maxFontWeight: 500,           // Bans font-semibold, font-bold
      disallowArbitrarySizes: true, // Bans arbitrary bracket values: text-[13px]
      disallowUppercase: true,      // Bans uppercase and capitalize transforms
    },
    geometry: {
      maxControlHeight: 36,         // Caps buttons, tabs, inputs at 36px
      allowedRadii: ["0px", "8px", "12px", "16px", "9999px"],
      radiiExceptions: {
        Checkbox: ["4px"],          // 4px is strictly limited to checkboxes
      },
    },
    colors: {
      bannedColorFamilies: ["indigo", "purple", "rose", "cyan"],
      disallowRawHex: true,         // Bans inline #1C1C1C, rgb(), rgba()
      disallowButtonChipColors: true,
    },
  },
  components: {
    disallowRawHtml: {
      button: { replaceWith: "Button", importFrom: "@/components/ui/button" },
      select: { replaceWith: "Dropdown", importFrom: "@/components/ui/dropdown" },
      table: { replaceWith: "Table", importFrom: "@/components/ui/table" },
    },
    disallowPseudoChips: true,
  },
  rules: {
    "no-text-arrows": "error",
    "no-backdrop-blur": "error",
    "table-head-icon-required": "error",
    "table-resizable-required": "error",
    "table-no-cell-stacking": "error",
    "table-windowed-pagination": "error",
    "tabs-component-required": "error",
  },
});
```

---

## 🤖 Teaching AI Assistants (`dse export-rules`)

Keep your AI agents (Cursor, Antigravity, Claude, Copilot) aligned with your design system automatically:

```bash
# Export and sync markdown rules directly into AGENTS.md or .cursorrules:
npx dse export-rules -w AGENTS.md
```

This ensures AI coding agents know your typography limits, button rules, and component imports before generating code!

---

## 🚫 Inline Overrides & Ignore Comments

For rare, intentional exceptions:

```tsx
// Ignore a specific line:
// dse-ignore
<span className="text-[11px]">Legacy notice</span>

// Ignore button color rule:
// dse-ignore-button-color
<Button className="bg-red-600">Delete</Button>

// Ignore control height cap:
// dse-ignore-height
<Button className="h-12">Hero CTA</Button>
```

---

## 🚀 Next.js Dev Runtime Integration

To catch violations immediately in development mode, call the programmatic API in your root layout:

```tsx
// src/app/layout.tsx
if (process.env.NODE_ENV === "development") {
  const { scanProject } = require("design-system-enforcer");
  scanProject().then((result) => {
    if (result.errorCount > 0) {
      console.error(
        \`[DSE] Found \${result.errorCount} design system violation(s)!\`
      );
    }
  });
}
```

---

## 📄 License

MIT © [Muzammil](https://github.com/not-muzammil)
