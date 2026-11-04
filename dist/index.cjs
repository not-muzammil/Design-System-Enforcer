#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DesignSystemRuntimeError: () => DesignSystemRuntimeError,
  DseGuard: () => DseGuard,
  assertValidStyles: () => assertValidStyles,
  computeDoctorScore: () => computeDoctorScore,
  defineConfig: () => defineConfig,
  detectProject: () => detectProject,
  dseAstroPlugin: () => dseAstroPlugin,
  generateAgentInstructions: () => generateAgentInstructions,
  installPreCommitHook: () => installPreCommitHook,
  loadConfig: () => loadConfig,
  runDseFix: () => runDseFix,
  runDseScan: () => runDseScan
});
module.exports = __toCommonJS(index_exports);

// src/runtime/core.ts
var DesignSystemRuntimeError = class extends Error {
  techStack;
  rule;
  receivedValue;
  constructor(violation) {
    const banner = `
========================================================
[DSE RUNTIME ERROR: ${violation.techStack.toUpperCase()}]
========================================================
Rule: ${violation.rule}
${violation.message}
${violation.receivedValue ? `Received Value: ${JSON.stringify(violation.receivedValue)}
` : ""}========================================================
`;
    super(banner);
    this.name = "DesignSystemRuntimeError";
    this.techStack = violation.techStack;
    this.rule = violation.rule;
    this.receivedValue = violation.receivedValue;
  }
};
function assertValidStyles(classesOrStyles, componentName, techStack = "react") {
  if (!classesOrStyles) return;
  if (typeof classesOrStyles === "string") {
    const hexMatch = classesOrStyles.match(/#(?:[0-9a-fA-F]{3,8})\b/);
    if (hexMatch) {
      throw new DesignSystemRuntimeError({
        techStack,
        rule: "no-hardcoded-colors",
        message: `Hardcoded hex color '${hexMatch[0]}' rendered in <${componentName}>. All colors must use design system tokens ('var(--primary)', 'neutral-*').`,
        elementOrComponent: componentName,
        receivedValue: hexMatch[0]
      });
    }
    const rawColorMatch = classesOrStyles.match(/\b(?:bg|text|border)-(?:blue|indigo|purple|violet|pink|fuchsia|cyan|teal|rose)-[0-9]{2,3}\b/);
    if (rawColorMatch) {
      throw new DesignSystemRuntimeError({
        techStack,
        rule: "no-hardcoded-colors",
        message: `Hardcoded color utility '${rawColorMatch[0]}' rendered in <${componentName}>. Colors outside design system tokens are strictly forbidden.`,
        elementOrComponent: componentName,
        receivedValue: rawColorMatch[0]
      });
    }
    const isCompact = ["Button", "IconButton", "Chip", "Badge", "Tab", "TableHead"].includes(componentName);
    if (isCompact && /\b(?:whitespace-normal|whitespace-pre-wrap|flex-wrap)\b/.test(classesOrStyles)) {
      throw new DesignSystemRuntimeError({
        techStack,
        rule: "no-wrapping-compact-elements",
        message: `Disallowed text wrapping class detected on compact component <${componentName}>. Compact elements must include 'whitespace-nowrap shrink-0'.`,
        elementOrComponent: componentName,
        receivedValue: classesOrStyles
      });
    }
  }
  if (typeof classesOrStyles === "object") {
    for (const [prop, val] of Object.entries(classesOrStyles)) {
      if (typeof val === "string") {
        if (/#(?:[0-9a-fA-F]{3,8})\b/.test(val) || /^rgb/i.test(val)) {
          throw new DesignSystemRuntimeError({
            techStack,
            rule: "no-hardcoded-colors",
            message: `Inline hardcoded style '${prop}: ${val}' rendered on <${componentName}>. Colors must reference CSS variables (e.g. 'var(--primary)').`,
            elementOrComponent: componentName,
            receivedValue: { [prop]: val }
          });
        }
      }
    }
  }
}

// src/runtime/react.tsx
var import_react = __toESM(require("react"), 1);
var import_jsx_runtime = require("react/jsx-runtime");
var DseGuard = ({ children, strict = true }) => {
  if (process.env.NODE_ENV === "production" && !strict) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
  }
  const inspectTree = (node) => {
    if (!import_react.default.isValidElement(node)) return node;
    const props = node.props;
    const type = node.type;
    const tagName = typeof type === "string" ? type : type.name || "Component";
    if (typeof type === "string") {
      const bannedHtml = ["button", "select", "textarea"];
      if (bannedHtml.includes(type.toLowerCase())) {
        throw new DesignSystemRuntimeError({
          techStack: "react",
          rule: "no-raw-html-elements",
          message: `Raw browser default '<${type}>' rendered at runtime. You must use canonical '<Button>', '<Dropdown>', or '<Textarea>' components.`,
          elementOrComponent: type
        });
      }
      if (type.toLowerCase() === "input" && ["checkbox", "radio", "range", "color"].includes(props.type)) {
        throw new DesignSystemRuntimeError({
          techStack: "react",
          rule: "no-raw-html-elements",
          message: `Raw browser default '<input type="${props.type}">' rendered at runtime. Use standard design system '<Checkbox>' or '<Slider>'.`,
          elementOrComponent: `input[type=${props.type}]`
        });
      }
    }
    assertValidStyles(props.className, tagName, "react");
    assertValidStyles(props.style, tagName, "react");
    if (props.children) {
      return import_react.default.cloneElement(node, {
        ...props,
        children: import_react.default.Children.map(props.children, inspectTree)
      });
    }
    return node;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: import_react.default.Children.map(children, inspectTree) });
};

// src/runtime/astro.ts
function dseAstroPlugin(options = {}) {
  return {
    name: "vite-plugin-dse-astro",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".astro") && !id.endsWith(".jsx") && !id.endsWith(".tsx")) {
        return null;
      }
      const hexMatch = code.match(/className=["'][^"']*?(#(?:[0-9a-fA-F]{3,8}))[^"']*?["']/);
      if (hexMatch) {
        throw new DesignSystemRuntimeError({
          techStack: "astro",
          rule: "no-hardcoded-colors",
          message: `In ${id}: Disallowed hardcoded hex color '${hexMatch[1]}' found in template. All colors must use tokens.`,
          receivedValue: hexMatch[1]
        });
      }
      if (/<button\b[^>]*>/i.test(code) && !id.includes("components/ui/button")) {
        throw new DesignSystemRuntimeError({
          techStack: "astro",
          rule: "no-raw-html-elements",
          message: `In ${id}: Raw browser default '<button>' found. Use '<Button>' primitive from your design system.`,
          elementOrComponent: "button"
        });
      }
      return null;
    }
  };
}

// src/config/loader.ts
var import_node_fs3 = __toESM(require("fs"), 1);
var import_node_path3 = __toESM(require("path"), 1);
var import_node_url = require("url");

// src/config/presets/berserk.ts
var berserkPreset = {
  preset: "berserk",
  targetDir: "src",
  include: ["**/*.{tsx,jsx,ts,js}"],
  exclude: [
    "**/node_modules/**",
    "**/.next/**",
    "**/public/**",
    "**/.git/**",
    "**/dist/**",
    "src/lib/primitives.ts",
    "src/lib/tokens.ts",
    "src/lib/dse-scanner.ts",
    "src/app/globals.css",
    "src/components/ui/badge.tsx",
    "src/components/ui/button.tsx",
    "src/components/ui/buttony-icon.tsx",
    "src/components/ui/card.tsx",
    "src/components/ui/checkbox.tsx",
    "src/components/ui/chip.tsx",
    "src/components/ui/dropdown.tsx",
    "src/components/ui/floating-action-bar.tsx",
    "src/components/ui/folder-combobox.tsx",
    "src/components/ui/icon-button.tsx",
    "src/components/ui/input.tsx",
    "src/components/ui/portal.tsx",
    "src/components/ui/skeleton.tsx",
    "src/components/ui/spinner.tsx",
    "src/components/ui/table.tsx",
    "src/components/ui/tabs.tsx",
    "src/components/ui/textarea.tsx",
    "src/components/ui/toggle.tsx",
    "src/components/ui/tooltip.tsx",
    "src/components/design-system/**",
    "src/db/**",
    "src/app/api/**",
    "src/engine/**",
    "src/services/**",
    "src/lib/auth/two-factor.ts"
  ],
  tokens: {
    typography: {
      minFontSize: "14px",
      maxFontSize: "32px",
      maxFontWeight: 500,
      disallowArbitrarySizes: true,
      disallowUppercase: true,
      allowXsOn: []
    },
    geometry: {
      maxControlHeight: 36,
      allowedRadii: ["0", "0px", "8px", "12px", "16px", "9999px", "100%"],
      radiiExceptions: {
        Checkbox: ["0", "0px", "4px", "0.25rem", "8px", "12px", "16px", "9999px", "100%"]
      }
    },
    colors: {
      bannedColorFamilies: [
        "slate",
        "gray",
        "zinc",
        "stone",
        "orange",
        "yellow",
        "lime",
        "green",
        "teal",
        "cyan",
        "sky",
        "indigo",
        "violet",
        "purple",
        "fuchsia",
        "pink",
        "rose"
      ],
      disallowRawHex: true,
      disallowButtonChipColors: true,
      disallowSaturatedGradients: true,
      disallowHardcodedColors: true
    }
  },
  components: {
    disallowRawHtml: {
      button: { replaceWith: "Button", importFrom: "@/components/ui/button", checkRawElement: true },
      select: { replaceWith: "Dropdown", importFrom: "@/components/ui/dropdown", checkRawElement: true },
      textarea: { replaceWith: "Textarea", importFrom: "@/components/ui/textarea", checkRawElement: true },
      progress: { replaceWith: "ProgressBar", importFrom: "@/components/ui/progress", checkRawElement: true },
      dialog: { replaceWith: "Modal or Dialog", importFrom: "@/components/ui/modal", checkRawElement: true },
      table: { replaceWith: "Table", importFrom: "@/components/ui/table", checkRawElement: true },
      thead: { replaceWith: "TableHeader", importFrom: "@/components/ui/table", checkRawElement: true },
      tbody: { replaceWith: "TableBody", importFrom: "@/components/ui/table", checkRawElement: true },
      tr: { replaceWith: "TableRow", importFrom: "@/components/ui/table", checkRawElement: true },
      th: { replaceWith: "TableHead", importFrom: "@/components/ui/table", checkRawElement: true },
      td: { replaceWith: "TableCell", importFrom: "@/components/ui/table", checkRawElement: true }
    },
    disallowPseudoChips: true,
    requiredInventory: [
      { name: "Button", componentName: "Button", importPath: "@/components/ui/button" },
      { name: "Input", componentName: "Input", importPath: "@/components/ui/input" },
      { name: "Chip", altNames: ["Chip", "Badge"], componentName: "Chip", importPath: "@/components/ui/chip" },
      { name: "Card", componentName: "Card", importPath: "@/components/ui/card" },
      { name: "Dropdown", componentName: "Dropdown", importPath: "@/components/ui/dropdown" },
      { name: "FloatingActionBar", componentName: "FloatingActionBar", importPath: "@/components/ui/floating-action-bar" },
      { name: "FolderCombobox", componentName: "FolderCombobox", importPath: "@/components/ui/folder-combobox" },
      { name: "IconButton", altNames: ["ButtonyIcon", "IconButton"], componentName: "IconButton", importPath: "@/components/ui/icon-button" },
      { name: "Skeleton", altNames: ["Skeleton", "CardSkeleton", "TableSkeleton", "MetricsGridSkeleton"], componentName: "Skeleton", importPath: "@/components/ui/skeleton" },
      { name: "Table", altNames: ["Table", "DataTableContainer", "DataTableScrollArea", "TableHeader", "TableBody", "TableRow", "TableCell", "TableHead"], componentName: "Table", importPath: "@/components/ui/table" },
      { name: "Tabs", altNames: ["Tabs"], componentName: "Tabs", importPath: "@/components/ui/tabs" },
      { name: "Checkbox", altNames: ["Checkbox"], componentName: "Checkbox", importPath: "@/components/ui/checkbox" },
      { name: "Toggle", altNames: ["Toggle"], componentName: "Toggle", importPath: "@/components/ui/toggle" },
      { name: "Textarea", altNames: ["Textarea"], componentName: "Textarea", importPath: "@/components/ui/textarea" }
    ]
  },
  rules: {
    "font-size-min": "error",
    "font-size-max": "error",
    "font-weight-max": "error",
    "no-arbitrary-text-size": "error",
    "no-uppercase-text": "error",
    "control-height-max": "error",
    "corner-radius-allowed": "error",
    "no-banned-colors": "error",
    "no-raw-hex-colors": "error",
    "no-raw-html-elements": "error",
    "no-pseudo-chips": "error",
    "no-chip-colored-buttons": "error",
    "no-text-arrows": "error",
    "no-backdrop-blur": "error",
    "no-unapproved-gradients": "error",
    "modal-backdrop-standard": "error",
    "table-resizable-required": "error",
    "table-head-icon-required": "error",
    "table-single-border": "error",
    "table-no-divide-y": "error",
    "table-uniform-typography": "error",
    "table-no-cell-stacking": "error",
    "table-no-horizontal-stacking": "error",
    "table-windowed-pagination": "error",
    "tabs-component-required": "error",
    "component-inventory-active": "error",
    "no-wrapping-compact-elements": "error",
    "no-hardcoded-colors": "error"
  }
};

// src/config/presets/default.ts
var defaultPreset = {
  preset: "recommended",
  targetDir: "src",
  include: ["**/*.{tsx,jsx,ts,js}"],
  exclude: [
    "**/node_modules/**",
    "**/.next/**",
    "**/public/**",
    "**/.git/**",
    "**/dist/**"
  ],
  tokens: {
    typography: {
      minFontSize: "14px",
      maxFontSize: "36px",
      maxFontWeight: 600,
      disallowArbitrarySizes: false,
      disallowUppercase: true,
      allowXsOn: []
    },
    geometry: {
      maxControlHeight: 40,
      allowedRadii: ["0", "0px", "4px", "6px", "8px", "12px", "16px", "9999px", "100%"]
    },
    colors: {
      disallowRawHex: false,
      disallowButtonChipColors: true
    }
  },
  components: {
    disallowRawHtml: {
      button: { replaceWith: "Button", importFrom: "@/components/ui/button", checkRawElement: true },
      select: { replaceWith: "Dropdown", importFrom: "@/components/ui/dropdown", checkRawElement: true },
      textarea: { replaceWith: "Textarea", importFrom: "@/components/ui/textarea", checkRawElement: true },
      progress: { replaceWith: "ProgressBar", importFrom: "@/components/ui/progress", checkRawElement: true },
      dialog: { replaceWith: "Modal or Dialog", importFrom: "@/components/ui/modal", checkRawElement: true }
    },
    disallowPseudoChips: true
  },
  rules: {
    "font-size-min": "error",
    "no-uppercase-text": "warn",
    "no-raw-html-elements": "error",
    "no-pseudo-chips": "warn",
    "no-chip-colored-buttons": "error",
    "no-text-arrows": "error",
    "no-backdrop-blur": "warn",
    "no-wrapping-compact-elements": "warn"
  }
};

// src/config/presets/python.ts
var pythonPreset = {
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
    "**/*.egg-info/**"
  ],
  tokens: {
    typography: {
      minFontSize: "14px",
      maxFontSize: "32px",
      maxFontWeight: 500,
      disallowArbitrarySizes: true,
      disallowUppercase: true,
      allowXsOn: []
    },
    geometry: {
      maxControlHeight: 36,
      allowedRadii: ["0px", "8px", "12px", "16px", "9999px"]
    },
    colors: {
      disallowRawHex: true,
      disallowButtonChipColors: true
    }
  },
  components: {
    disallowRawHtml: {},
    requiredInventory: []
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
    "component-inventory-active": "off"
  }
};

// src/detector/index.ts
var import_node_fs2 = __toESM(require("fs"), 1);
var import_node_path2 = __toESM(require("path"), 1);

// src/detector/ignores.ts
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);
var DEFAULT_IGNORES = [
  "**/node_modules/**",
  "**/.next/**",
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/.turbo/**",
  "**/.git/**",
  "**/coverage/**",
  "**/.venv/**",
  "**/venv/**",
  "**/env/**",
  "**/__pycache__/**",
  "**/.pytest_cache/**",
  "**/*.pyc",
  // Non-UI code
  "**/api/**",
  "**/*.test.*",
  "**/*.spec.*",
  "**/__tests__/**",
  "**/*.stories.*",
  "**/generated/**"
];
function getSmartIgnores(cwd) {
  const result = new Set(DEFAULT_IGNORES);
  const gitignorePath = import_node_path.default.resolve(cwd, ".gitignore");
  if (import_node_fs.default.existsSync(gitignorePath)) {
    try {
      const content = import_node_fs.default.readFileSync(gitignorePath, "utf-8");
      const lines = content.split(/\r?\n/);
      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith("#")) continue;
        if (line.startsWith("/")) {
          line = line.substring(1);
        }
        if (line.endsWith("/")) {
          line = line.slice(0, -1);
        }
        if (line) {
          result.add(`**/${line}/**`);
          result.add(`**/${line}`);
        }
      }
    } catch {
    }
  }
  return Array.from(result);
}

// src/detector/index.ts
function safeReadJson(filePath) {
  try {
    if (import_node_fs2.default.existsSync(filePath)) {
      const raw = import_node_fs2.default.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
  }
  return null;
}
function detectProject(cwd = process.cwd()) {
  const pkg = safeReadJson(import_node_path2.default.resolve(cwd, "package.json"));
  const deps = { ...pkg?.dependencies || {}, ...pkg?.devDependencies || {} };
  const hasRequirements = import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "requirements.txt"));
  const hasPyproject = import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "pyproject.toml"));
  const hasPython = hasRequirements || hasPyproject || import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "setup.py"));
  let isStreamlit = false;
  if (hasPython) {
    if (hasRequirements) {
      try {
        const reqContent = import_node_fs2.default.readFileSync(import_node_path2.default.resolve(cwd, "requirements.txt"), "utf-8");
        if (reqContent.toLowerCase().includes("streamlit")) {
          isStreamlit = true;
        }
      } catch {
      }
    }
  }
  const isPnpmMonorepo = import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "pnpm-workspace.yaml"));
  const isTurbo = import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "turbo.json"));
  let monorepoWorkspaces = [];
  if (Array.isArray(pkg?.workspaces)) {
    monorepoWorkspaces = pkg.workspaces;
  } else if (pkg?.workspaces?.packages) {
    monorepoWorkspaces = pkg.workspaces.packages;
  }
  const isMonorepo = isPnpmMonorepo || isTurbo || monorepoWorkspaces.length > 0;
  let framework = "unknown";
  if (deps["next"]) {
    framework = "nextjs";
  } else if (deps["vite"]) {
    framework = "vite";
  } else if (deps["@remix-run/react"]) {
    framework = "remix";
  } else if (deps["astro"]) {
    framework = "astro";
  } else if (deps["react-scripts"]) {
    framework = "react-cra";
  } else if (isStreamlit) {
    framework = "streamlit";
  } else if (hasPython) {
    framework = "python-general";
  }
  const libraries = [];
  const hasShadcnConfig = import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "components.json"));
  if (hasShadcnConfig || deps["@radix-ui/react-slot"]) {
    libraries.push("shadcn");
  }
  if (Object.keys(deps).some((d) => d.startsWith("@radix-ui/"))) {
    if (!libraries.includes("shadcn")) libraries.push("radix");
  }
  if (deps["tailwindcss"]) {
    libraries.push("tailwind");
  }
  if (deps["lucide-react"] || deps["lucide"]) {
    libraries.push("lucide");
  }
  if (deps["@mui/material"] || deps["@material-ui/core"]) {
    libraries.push("mui");
  }
  if (deps["@chakra-ui/react"]) {
    libraries.push("chakra");
  }
  const hasTailwind = Boolean(deps["tailwindcss"] || import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "tailwind.config.js")) || import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "tailwind.config.ts")));
  let tailwindVersion;
  if (hasTailwind) {
    const rawVersion = deps["tailwindcss"] || "";
    if (rawVersion.includes("^4") || rawVersion.includes("~4") || rawVersion.startsWith("4")) {
      tailwindVersion = "v4";
    } else {
      tailwindVersion = "v3";
    }
  }
  const hasTypeScript = Boolean(deps["typescript"] || import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "tsconfig.json")));
  const suggestedIncludes = [];
  const extGroup = hasTypeScript ? "{tsx,jsx,ts,js}" : "{jsx,js}";
  const candidateDirs = [
    "frontend/src",
    "frontend",
    "apps/web/src",
    "apps/web",
    "client/src",
    "client",
    "src",
    "app",
    "pages",
    "components"
  ];
  let foundUiDir = false;
  for (const dir of candidateDirs) {
    if (import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, dir))) {
      if (dir === "frontend" && import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "frontend/src"))) continue;
      if (dir === "client" && import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "client/src"))) continue;
      if (dir === "apps/web" && import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, "apps/web/src"))) continue;
      suggestedIncludes.push(`${dir}/**/*.${extGroup}`);
      foundUiDir = true;
      break;
    }
  }
  if (hasPython) {
    suggestedIncludes.push("**/*.py");
  } else if (!foundUiDir) {
    suggestedIncludes.push(`**/*.${extGroup}`);
  }
  const suggestedIgnores = getSmartIgnores(cwd);
  if (hasShadcnConfig || libraries.includes("shadcn")) {
    suggestedIgnores.push("**/components/ui/**");
  }
  const tokenCandidates = [
    "frontend/src/lib/tokens.ts",
    "frontend/src/tokens.ts",
    "src/lib/tokens.ts",
    "src/tokens.ts",
    "src/design/tokens.ts",
    "styles/tokens.css",
    "src/app/globals.css",
    "frontend/src/index.css",
    "src/index.css"
  ];
  let tokensFile;
  for (const candidate of tokenCandidates) {
    if (import_node_fs2.default.existsSync(import_node_path2.default.resolve(cwd, candidate))) {
      tokensFile = candidate;
      break;
    }
  }
  let preset = "berserk";
  if (framework === "streamlit" || framework === "python-general") {
    preset = "python";
  }
  return {
    root: cwd,
    isMonorepo,
    monorepoWorkspaces,
    framework,
    libraries,
    hasTailwind,
    tailwindVersion,
    hasTypeScript,
    hasPython,
    suggestedIncludes,
    suggestedIgnores,
    tokensFile,
    preset
  };
}

// src/config/loader.ts
var CONFIG_FILES = [
  "dse.config.js",
  "dse.config.mjs",
  "dse.config.cjs",
  "dse.config.ts",
  "dse.config.json",
  ".dserc.json",
  ".dserc"
];
function defineConfig(config2) {
  return config2;
}
async function loadConfig(cwd = process.cwd(), customPath) {
  const detected = detectProject(cwd);
  let userConfig = {};
  let foundConfigPath = null;
  if (customPath) {
    const resolved = import_node_path3.default.resolve(cwd, customPath);
    if (import_node_fs3.default.existsSync(resolved)) {
      foundConfigPath = resolved;
    }
  } else {
    for (const filename of CONFIG_FILES) {
      const candidate = import_node_path3.default.resolve(cwd, filename);
      if (import_node_fs3.default.existsSync(candidate)) {
        foundConfigPath = candidate;
        break;
      }
    }
  }
  if (foundConfigPath) {
    if (foundConfigPath.endsWith(".json") || foundConfigPath.endsWith(".dserc")) {
      const content = import_node_fs3.default.readFileSync(foundConfigPath, "utf-8");
      try {
        userConfig = JSON.parse(content);
      } catch (err) {
        console.error(`Failed to parse JSON config at ${foundConfigPath}:`, err);
      }
    } else {
      try {
        const fileUrl = (0, import_node_url.pathToFileURL)(foundConfigPath).href;
        const mod = await import(fileUrl);
        userConfig = mod.default || mod;
      } catch {
        try {
          const content = import_node_fs3.default.readFileSync(foundConfigPath, "utf-8");
          const cjsReq = createCjsEvaluator(foundConfigPath, content);
          userConfig = cjsReq;
        } catch (innerErr) {
          console.warn(`Could not load config file at ${foundConfigPath}, using default preset.`, innerErr);
        }
      }
    }
  }
  let presetName = userConfig.preset || detected.preset;
  let basePreset = berserkPreset;
  if (presetName === "python") {
    basePreset = pythonPreset;
  } else if (presetName === "recommended") {
    basePreset = defaultPreset;
  }
  const autonomousDefaults = {
    include: detected.suggestedIncludes,
    exclude: detected.suggestedIgnores
  };
  const withAutonomous = mergeConfigs(basePreset, autonomousDefaults);
  return mergeConfigs(withAutonomous, userConfig);
}
function createCjsEvaluator(filePath, content) {
  if (content.includes("export default")) {
    return {};
  }
  return {};
}
function mergeConfigs(base, overrides) {
  return {
    ...base,
    ...overrides,
    preset: overrides.preset || base.preset,
    targetDir: overrides.targetDir || base.targetDir,
    include: overrides.include || base.include,
    exclude: [...base.exclude || [], ...overrides.exclude || []],
    tokens: {
      typography: {
        ...base.tokens?.typography || {},
        ...overrides.tokens?.typography || {}
      },
      geometry: {
        ...base.tokens?.geometry || {},
        ...overrides.tokens?.geometry || {},
        radiiExceptions: {
          ...base.tokens?.geometry?.radiiExceptions || {},
          ...overrides.tokens?.geometry?.radiiExceptions || {}
        }
      },
      colors: {
        ...base.tokens?.colors || {},
        ...overrides.tokens?.colors || {}
      }
    },
    components: {
      disallowRawHtml: {
        ...base.components?.disallowRawHtml || {},
        ...overrides.components?.disallowRawHtml || {}
      },
      disallowPseudoChips: overrides.components?.disallowPseudoChips ?? base.components?.disallowPseudoChips,
      requiredInventory: overrides.components?.requiredInventory || base.components?.requiredInventory
    },
    rules: {
      ...base.rules || {},
      ...overrides.rules || {}
    }
  };
}

// src/rules/runner.ts
var import_node_fs4 = __toESM(require("fs"), 1);
var import_node_path4 = __toESM(require("path"), 1);
var import_fast_glob = __toESM(require("fast-glob"), 1);

// src/parser/ast.ts
var import_typescript = __toESM(require("typescript"), 1);
function parseTsx(filePath, content) {
  const isTsx = filePath.endsWith(".tsx") || filePath.endsWith(".jsx");
  const kind = isTsx ? import_typescript.default.ScriptKind.TSX : import_typescript.default.ScriptKind.TS;
  return import_typescript.default.createSourceFile(
    filePath,
    content,
    import_typescript.default.ScriptTarget.Latest,
    true,
    // setParentNodes = true for parent traversal
    kind
  );
}
function getNodePosition(sourceFile, node) {
  const start = node.getStart(sourceFile);
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(start);
  return { line: line + 1, col: character + 1 };
}
function getJsxTagName(node, sourceFile) {
  if (import_typescript.default.isJsxElement(node)) {
    return node.openingElement.tagName.getText(sourceFile);
  }
  if (import_typescript.default.isJsxSelfClosingElement(node)) {
    return node.tagName.getText(sourceFile);
  }
  if (import_typescript.default.isJsxOpeningElement(node)) {
    return node.tagName.getText(sourceFile);
  }
  return null;
}
function getJsxAttributes(node, sourceFile) {
  const attributes = {};
  const propContainer = import_typescript.default.isJsxElement(node) ? node.openingElement.attributes : import_typescript.default.isJsxSelfClosingElement(node) || import_typescript.default.isJsxOpeningElement(node) ? node.attributes : null;
  if (!propContainer) return attributes;
  propContainer.properties.forEach((prop) => {
    if (import_typescript.default.isJsxAttribute(prop)) {
      const name = prop.name.getText(sourceFile);
      attributes[name] = {
        node: prop,
        initializer: prop.initializer || null,
        rawText: prop.getText(sourceFile)
      };
    } else if (import_typescript.default.isJsxSpreadAttribute(prop)) {
      attributes[`__spread_${prop.getStart(sourceFile)}`] = {
        node: prop,
        isSpread: true,
        rawText: prop.getText(sourceFile)
      };
    }
  });
  return attributes;
}
function extractClassNames(initializer, sourceFile) {
  const result = [];
  if (!initializer) return result;
  function collectStrings(node) {
    if (!node) return;
    if (import_typescript.default.isStringLiteral(node) || import_typescript.default.isNoSubstitutionTemplateLiteral(node)) {
      result.push({ text: node.text, node });
      return;
    }
    if (import_typescript.default.isTemplateExpression(node)) {
      if (node.head.text) {
        result.push({ text: node.head.text, node: node.head });
      }
      for (const span of node.templateSpans) {
        collectStrings(span.expression);
        if (span.literal.text) {
          result.push({ text: span.literal.text, node: span.literal });
        }
      }
      return;
    }
    if (import_typescript.default.isJsxExpression(node)) {
      collectStrings(node.expression);
      return;
    }
    if (import_typescript.default.isParenthesizedExpression(node)) {
      collectStrings(node.expression);
      return;
    }
    if (import_typescript.default.isBinaryExpression(node)) {
      collectStrings(node.left);
      collectStrings(node.right);
      return;
    }
    if (import_typescript.default.isConditionalExpression(node)) {
      collectStrings(node.whenTrue);
      collectStrings(node.whenFalse);
      return;
    }
    if (import_typescript.default.isArrayLiteralExpression(node)) {
      for (const element of node.elements) {
        collectStrings(element);
      }
      return;
    }
    if (import_typescript.default.isCallExpression(node)) {
      for (const arg of node.arguments) {
        collectStrings(arg);
      }
      return;
    }
    if (import_typescript.default.isObjectLiteralExpression(node)) {
      for (const prop of node.properties) {
        if (import_typescript.default.isPropertyAssignment(prop)) {
          if (import_typescript.default.isStringLiteral(prop.name) || import_typescript.default.isIdentifier(prop.name)) {
            result.push({ text: prop.name.text, node: prop.name });
          }
        }
      }
      return;
    }
  }
  collectStrings(initializer);
  return result;
}
function getFileImports(sourceFile) {
  const imports = {};
  import_typescript.default.forEachChild(sourceFile, (node) => {
    if (import_typescript.default.isImportDeclaration(node) && node.importClause) {
      const moduleSpecifier = import_typescript.default.isStringLiteral(node.moduleSpecifier) ? node.moduleSpecifier.text : "";
      if (node.importClause.name) {
        imports[node.importClause.name.text] = moduleSpecifier;
      }
      if (node.importClause.namedBindings) {
        if (import_typescript.default.isNamedImports(node.importClause.namedBindings)) {
          node.importClause.namedBindings.elements.forEach((spec) => {
            const localName = spec.name.text;
            imports[localName] = moduleSpecifier;
          });
        } else if (import_typescript.default.isNamespaceImport(node.importClause.namedBindings)) {
          imports[node.importClause.namedBindings.name.text] = moduleSpecifier;
        }
      }
    }
  });
  return imports;
}

// src/rules/ast-rules.ts
var import_typescript2 = __toESM(require("typescript"), 1);

// src/tokens/index.ts
function splitClassString(str) {
  if (!str || typeof str !== "string") return [];
  return str.split(/\s+/).filter(Boolean);
}
function decomposeToken(rawToken) {
  if (!rawToken || typeof rawToken !== "string") return null;
  const parts = [];
  let bracketDepth = 0;
  let current = "";
  for (let i = 0; i < rawToken.length; i++) {
    const char = rawToken[i];
    if (char === "[" || char === "(") {
      bracketDepth++;
      current += char;
    } else if (char === "]" || char === ")") {
      bracketDepth = Math.max(0, bracketDepth - 1);
      current += char;
    } else if (char === ":" && bracketDepth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current) parts.push(current);
  const core = parts.pop() || "";
  const variants = parts;
  return { raw: rawToken, core, variants };
}
function evaluateTypographyToken(core, config2) {
  const violations = [];
  const minFont = config2?.minFontSize || "14px";
  const maxFont = config2?.maxFontSize || "32px";
  const maxWeight = config2?.maxFontWeight ?? 500;
  const disallowArbitrary = config2?.disallowArbitrarySizes ?? true;
  const disallowUppercase = config2?.disallowUppercase ?? true;
  if (/^text-(?:xs|2xs)$/.test(core)) {
    violations.push({
      rule: "font-size-min",
      message: `Disallowed font size '${core}' is smaller than ${minFont}. Primary body font must strictly be standard ${minFont} ('text-sm').`
    });
  }
  const arbitrarySizeMatch = core.match(/^text-\[(\d+(?:\.\d+)?)(px|rem|em)\]$/);
  if (arbitrarySizeMatch) {
    const num = parseFloat(arbitrarySizeMatch[1]);
    const unit = arbitrarySizeMatch[2];
    const pxVal = unit === "rem" || unit === "em" ? num * 16 : num;
    if (pxVal < 14) {
      violations.push({
        rule: "font-size-min",
        message: `Disallowed arbitrary font size '${core}' (${pxVal}px) is below minimum allowed size (${minFont}).`
      });
    } else if (pxVal > 32) {
      violations.push({
        rule: "font-size-max",
        message: `Disallowed arbitrary font size '${core}' (${pxVal}px) exceeds maximum allowed heading size (${maxFont}).`
      });
    } else if (disallowArbitrary) {
      violations.push({
        rule: "no-arbitrary-text-size",
        message: `Arbitrary font size '${core}' is prohibited. Use standard typography tokens ('text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl').`
      });
    }
  }
  if (/^text-(?:3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/.test(core)) {
    violations.push({
      rule: "font-size-max",
      message: `Disallowed font size '${core}' exceeds maximum allowed heading cap of ${maxFont}.`
    });
  }
  if (maxWeight <= 500) {
    if (/^font-(?:semibold|bold|extrabold|black)$/.test(core)) {
      violations.push({
        rule: "font-weight-max",
        message: `Disallowed font weight '${core}' exceeds maximum allowed weight (500 / Medium).`
      });
    }
    const arbitraryWeightMatch = core.match(/^font-\[(\d+)\]$/);
    if (arbitraryWeightMatch) {
      const weight = parseInt(arbitraryWeightMatch[1], 10);
      if (weight > maxWeight) {
        violations.push({
          rule: "font-weight-max",
          message: `Disallowed arbitrary font weight '${core}' (${weight}) exceeds maximum allowed weight (${maxWeight} / Medium).`
        });
      }
    }
  }
  if (disallowUppercase && core === "uppercase") {
    violations.push({
      rule: "no-uppercase-text",
      message: `CSS text transformation '${core}' is disallowed. Use standard sentence case or title case.`
    });
  }
  return violations;
}
function evaluateGeometryToken(core, config2, isCheckbox = false) {
  const violations = [];
  const allowedRadii = new Set(config2?.allowedRadii || ["0", "0px", "8px", "12px", "16px", "9999px", "100%"]);
  const checkboxRadii = new Set(config2?.radiiExceptions?.Checkbox || ["0", "0px", "4px", "0.25rem", "8px", "12px", "16px", "9999px", "100%"]);
  if (/^rounded(?:-(?:xs|sm|md|lg|xl|2xl|3xl|none|full))?$/.test(core)) {
    if (core === "rounded-xs" || core === "rounded") {
      if (!isCheckbox) {
        violations.push({
          rule: "corner-radius-allowed",
          message: `4px corner radius ('${core}') is strictly reserved for checkboxes only. Standard components must use 'rounded-md' (8px) or 'rounded-lg' (12px).`
        });
      }
    } else if (core === "rounded-2xl" || core === "rounded-3xl") {
      violations.push({
        rule: "corner-radius-allowed",
        message: `Oversized corner radius '${core}' is disallowed. Standard components must use 'rounded-md' (8px) or 'rounded-lg' (12px).`
      });
    }
  }
  const radiusMatch = core.match(/^rounded(?:-[trblse])?-\[([^\]]+)\]$/);
  if (radiusMatch) {
    const val = radiusMatch[1].trim();
    const effectiveSet = isCheckbox ? checkboxRadii : allowedRadii;
    if (!effectiveSet.has(val)) {
      violations.push({
        rule: "corner-radius-allowed",
        message: `Disallowed arbitrary corner radius '${core}' (${val}). Allowed values: ${Array.from(effectiveSet).join(", ")}.`
      });
    }
  }
  return violations;
}
function evaluateColorToken(core, config2) {
  const violations = [];
  const bannedFamilies = new Set(config2?.bannedColorFamilies || []);
  if (bannedFamilies.size > 0) {
    const colorMatch = core.match(/^(?:bg|text|border|ring|stroke|fill|from|to|via)-([a-z]+)-[0-9]{2,3}$/);
    if (colorMatch) {
      const family = colorMatch[1];
      if (bannedFamilies.has(family)) {
        violations.push({
          rule: "no-banned-colors",
          message: `Disallowed off-palette color class '${core}'. Color family '${family}' (purple, indigo, violet, etc.) is not permitted in our design system.`
        });
      }
    }
  }
  if (config2?.disallowSaturatedGradients) {
    if (core === "bg-clip-text" || core === "text-transparent") {
      violations.push({
        rule: "no-unapproved-gradients",
        message: `Gradient text styling '${core}' detected. Cheesy AI gradient text is prohibited. Use standard high-contrast text typography.`
      });
    }
  }
  if (config2?.disallowHardcodedColors) {
    const arbitraryColorMatch = core.match(/^(?:bg|text|border|ring|stroke|fill|from|to|via)-\[(#(?:[0-9a-fA-F]{3,8})|rgba?\(|hsla?\([^\]]+)\]/);
    if (arbitraryColorMatch) {
      violations.push({
        rule: "no-hardcoded-colors",
        message: `Disallowed hardcoded inline color '${core}'. Colors must not be hardcoded in application code. Use design system CSS variables (e.g. 'bg-[var(--primary)]') or token classes.`
      });
    }
    const rawPaletteMatch = core.match(/^(?:bg|text|border|ring|stroke|fill|from|to|via)-([a-z]+)(?:-[0-9]{2,3})?$/);
    if (rawPaletteMatch) {
      const family = rawPaletteMatch[1];
      const allowedFamilies = /* @__PURE__ */ new Set([
        "neutral",
        "transparent",
        "current",
        "inherit",
        "white",
        "black",
        "primary",
        "secondary",
        "muted",
        "accent",
        "border",
        "input",
        "background",
        "foreground"
      ]);
      if (!allowedFamilies.has(family)) {
        violations.push({
          rule: "no-hardcoded-colors",
          message: `Disallowed hardcoded color class '${core}'. Application code must only use design system tokens ('neutral-*' or 'var(--...)'). Primitive color palettes ('${family}') are only permitted inside canonical UI primitives.`
        });
      }
    }
  }
  return violations;
}

// src/rules/ast-rules.ts
function runAstRules(sourceFile, filePath, addViolation, fileImports, config2) {
  const isTsx = filePath.endsWith(".tsx") || filePath.endsWith(".jsx");
  if (!isTsx) return;
  const content = sourceFile.getFullText();
  const fileLines = content.split("\n");
  let hasTable = false;
  let hasTableHeader = false;
  let hasTableHead = false;
  let hasTableBody = false;
  let hasTableRow = false;
  let hasTableCell = false;
  let usesColumnHeader = false;
  let usesResizeDivider = false;
  let usesResizableHook = false;
  function visitNode(node, parent, ancestors) {
    if (import_typescript2.default.isJsxElement(node) || import_typescript2.default.isJsxSelfClosingElement(node)) {
      const tagName = getJsxTagName(node, sourceFile);
      if (!tagName) return;
      const attributes = getJsxAttributes(node, sourceFile);
      const pos = getNodePosition(sourceFile, node);
      const lineSnippet = fileLines[pos.line - 1] || "";
      if (lineSnippet.includes("dse-ignore") || pos.line > 1 && fileLines[pos.line - 2]?.includes("dse-ignore")) {
        return;
      }
      if (tagName === "Table") hasTable = true;
      else if (tagName === "TableHeader") hasTableHeader = true;
      else if (tagName === "TableHead") hasTableHead = true;
      else if (tagName === "TableBody") hasTableBody = true;
      else if (tagName === "TableRow") hasTableRow = true;
      else if (tagName === "TableCell") hasTableCell = true;
      else if (tagName === "TableColumnHeader") usesColumnHeader = true;
      else if (tagName === "TableResizeDivider") usesResizeDivider = true;
      if (config2.rules?.["no-raw-html-elements"] !== "off") {
        checkRawHtmlElements(tagName, attributes, pos, filePath, addViolation, lineSnippet, config2);
      }
      checkButtonInvariants(tagName, attributes, pos, filePath, addViolation, lineSnippet, config2);
      if (tagName === "TableHead") {
        checkTableHeadInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config2);
      }
      if (tagName === "TableBody" && config2.rules?.["table-no-divide-y"] !== "off") {
        checkTableBodyInvariants(attributes, pos, filePath, addViolation, lineSnippet, sourceFile);
      }
      if (tagName === "TableCell") {
        checkTableCellInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config2);
      }
      if (tagName === "Tabs" && config2.rules?.["tabs-component-required"] !== "off") {
        checkTabsElement(attributes, pos, filePath, addViolation, lineSnippet, fileImports);
      }
      if ((tagName === "span" || tagName === "div") && config2.rules?.["no-pseudo-chips"] !== "off") {
        checkPseudoChips(tagName, attributes, pos, filePath, addViolation, lineSnippet, sourceFile);
      }
      checkElementClasses(node, tagName, attributes, pos, filePath, addViolation, sourceFile, config2);
    }
    if (import_typescript2.default.isCallExpression(node)) {
      const fnName = node.expression.getText(sourceFile);
      if (fnName === "useResizableColumns") {
        usesResizableHook = true;
      }
    }
  }
  function walk(node, parent, ancestors) {
    visitNode(node, parent, ancestors);
    ancestors.push(node);
    import_typescript2.default.forEachChild(node, (child) => walk(child, node, ancestors));
    ancestors.pop();
  }
  walk(sourceFile, null, []);
  checkTableFileInvariants(
    filePath,
    content,
    addViolation,
    fileImports,
    hasTable,
    hasTableHeader,
    hasTableHead,
    hasTableBody,
    hasTableRow,
    hasTableCell,
    usesColumnHeader,
    usesResizeDivider,
    usesResizableHook,
    config2
  );
}
function checkRawHtmlElements(tagName, attributes, pos, filePath, addViolation, lineSnippet, config2) {
  if (tagName[0] !== tagName[0].toLowerCase()) {
    return;
  }
  const replacements = config2.components?.disallowRawHtml || {};
  const configEntry = replacements[tagName.toLowerCase()];
  if (configEntry) {
    addViolation(
      filePath,
      pos.line,
      pos.col,
      "no-raw-html-elements",
      `Raw '<${tagName}>' element detected. Use standard design system '<${configEntry.replaceWith}>' component${configEntry.importFrom ? ` from '${configEntry.importFrom}'` : ""}.`,
      lineSnippet
    );
    return;
  }
  if (tagName === "input") {
    const typeAttr = attributes.type;
    const typeVal = typeAttr && typeAttr.initializer ? typeAttr.initializer.getText().replace(/['"]/g, "") : "text";
    if (typeVal === "checkbox") {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-raw-html-elements",
        `Raw browser default '<input type="checkbox">' detected. Never use unstyled browser checkboxes. Use standard design system '<Checkbox>' or '<Toggle>'.`,
        lineSnippet
      );
    } else if (typeVal === "radio") {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-raw-html-elements",
        `Raw browser default '<input type="radio">' detected. Never use unstyled browser radio buttons. Use standard design system '<RadioGroup>' or styled toggle.`,
        lineSnippet
      );
    } else if (typeVal === "range") {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-raw-html-elements",
        `Raw browser default '<input type="range">' detected. Never use unstyled browser sliders. Use standard design system '<Slider>'.`,
        lineSnippet
      );
    } else if (typeVal === "file" && !(attributes.className?.initializer?.getText() || "").includes("hidden")) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-raw-html-elements",
        `Raw browser default '<input type="file">' detected. Never display native unstyled file picker inputs. Use a custom styled dropzone or trigger.`,
        lineSnippet
      );
    } else if (typeVal === "color") {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-raw-html-elements",
        `Raw browser default '<input type="color">' detected. Never use native browser color pickers. Use a custom color picker component.`,
        lineSnippet
      );
    } else if (["text", "email", "search", "password", "number", "tel", "url"].includes(typeVal)) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-raw-html-elements",
        `Raw browser default '<input type="${typeVal}">' element detected. Use standard design system '<Input>' component.`,
        lineSnippet
      );
    }
  }
}
function checkButtonInvariants(tagName, attributes, pos, filePath, addViolation, lineSnippet, config2) {
  const isButton = ["Button", "IconButton", "ButtonyIcon", "FloatingActionButton"].includes(tagName);
  if (!isButton) return;
  if (config2.rules?.["no-chip-colored-buttons"] !== "off" && attributes.variant && attributes.variant.initializer) {
    const varVal = attributes.variant.initializer.getText().replace(/['"]/g, "");
    if (["danger", "success", "warning", "error"].includes(varVal)) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-chip-colored-buttons",
        `Button uses semantic chip variant '${varVal}'. Buttons must use neutral variants ('primary', 'outline', 'secondary', 'ghost'). Semantic colors are reserved for <Chip>.`,
        lineSnippet
      );
    }
  }
}
function checkTableHeadInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config2) {
  const hasIconProp = Boolean(attributes.icon);
  const rawChildren = node.getText(sourceFile);
  const isCheckboxCol = /<(?:Checkbox\b|input[^>]*type=["']checkbox["'])/i.test(rawChildren) || /toggleSelect/i.test(rawChildren) || /selectedEmails|selectedIds|selectedLeadIds/i.test(rawChildren) || attributes.resizable?.initializer?.getText(sourceFile) === "{false}" && /checkbox/i.test(rawChildren);
  if (config2.rules?.["table-head-icon-required"] !== "off" && !hasIconProp && !isCheckboxCol) {
    addViolation(
      filePath,
      pos.line,
      pos.col,
      "table-head-icon-required",
      "<TableHead> is missing mandatory 'icon' prop (e.g. icon={<SomeIcon size={20} />}). All table headers must provide an icon component via the 'icon' prop.",
      lineSnippet
    );
  }
  if (config2.rules?.["table-resizable-required"] !== "off" && attributes.resizable && attributes.resizable.initializer) {
    const resizableVal = attributes.resizable.initializer.getText(sourceFile);
    if (resizableVal === "{false}" && !isCheckboxCol) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "table-resizable-required",
        "Table column header '<TableHead>' has disabled resizable columns with 'resizable={false}'. All data table columns must support column resizing.",
        lineSnippet
      );
    }
  }
  if (config2.rules?.["table-no-horizontal-stacking"] !== "off") {
    if (/(?:email\s*(?:&|\/)\s*deliverability|deliverability\s*(?:&|\/)\s*email|pages\s*(?:&|\/)\s*dupes|warmup\s*(?:&|\/)\s*deliverability)/i.test(rawChildren)) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "table-no-horizontal-stacking",
        "Combined column header detected in '<TableHead>'. Distinct metadata attributes must each reside in their own dedicated, resizable column with a distinct icon.",
        lineSnippet
      );
    }
  }
}
function checkTableBodyInvariants(attributes, pos, filePath, addViolation, lineSnippet, sourceFile) {
  if (attributes.className) {
    const classStrings = extractClassNames(attributes.className.initializer, sourceFile);
    const normPath = filePath.replace(/\\/g, "/");
    const isPrimitivesFile = normPath.includes("components/ui/") || normPath.includes("lib/tokens.") || normPath.includes("tokens.") || (config.tokens?.colors?.colorWhitelistPaths || []).some((wl) => normPath.includes(wl));
    const effectiveColorConfig = isPrimitivesFile ? { ...config.tokens?.colors, disallowHardcodedColors: false } : config.tokens?.colors;
    classStrings.forEach(({ text }) => {
      if (/\bdivide-y\b/.test(text)) {
        addViolation(
          filePath,
          pos.line,
          pos.col,
          "table-no-divide-y",
          "Disallowed 'divide-y' detected on '<TableBody>'. In our design system, TableRow natively implements single 'border-b border-neutral-200'. Using 'divide-y' produces double stroke borders.",
          lineSnippet
        );
      }
    });
  }
}
function checkTableCellInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config2) {
  if (attributes && attributes.colSpan) return;
  const childrenText = node.getText(sourceFile);
  let hasVerticalStack = false;
  let directBlockCount = 0;
  if (node.children) {
    node.children.forEach((child) => {
      if (import_typescript2.default.isJsxElement(child) || import_typescript2.default.isJsxSelfClosingElement(child)) {
        const tag = getJsxTagName(child, sourceFile);
        if (tag && ["div", "p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
          directBlockCount++;
        }
      }
    });
  }
  function inspectCellDescendant(child) {
    if (import_typescript2.default.isJsxElement(child) || import_typescript2.default.isJsxSelfClosingElement(child)) {
      const childTag = getJsxTagName(child, sourceFile);
      const childAttrs = getJsxAttributes(child, sourceFile);
      if (childAttrs.className) {
        const classes = extractClassNames(childAttrs.className.initializer, sourceFile);
        classes.forEach(({ text }) => {
          if (/\b(?:flex-col|grid-cols-1|space-y-\d+)\b/.test(text)) {
            hasVerticalStack = true;
          }
        });
      }
      if (config2.rules?.["table-uniform-typography"] !== "off") {
        const isExempt = childTag && ["Button", "IconButton", "ButtonyIcon", "Chip", "Badge", "Input", "Skeleton"].includes(childTag);
        if (!isExempt && childAttrs.className) {
          const classes = extractClassNames(childAttrs.className.initializer, sourceFile);
          classes.forEach(({ text }) => {
            const tokens = splitClassString(text);
            tokens.forEach((t) => {
              const dec = decomposeToken(t);
              if (!dec) return;
              if (/^text-neutral-(?:400|500|600|700|800)$/.test(dec.core)) {
                const childPos = getNodePosition(sourceFile, child);
                addViolation(
                  filePath,
                  childPos.line,
                  childPos.col,
                  "table-uniform-typography",
                  `Mismatched table text styling '${dec.core}' inside '<TableCell>'. Text in tables must use uniform styling ('text-text-primary').`,
                  lineSnippet
                );
              }
              if (/^text-(?:xs|2xs|base|lg|xl|2xl|3xl|4xl|5xl|\[[0-9]+px\])$/.test(dec.core)) {
                const childPos = getNodePosition(sourceFile, child);
                addViolation(
                  filePath,
                  childPos.line,
                  childPos.col,
                  "table-uniform-typography",
                  `Mismatched table text size '${dec.core}' inside '<TableCell>'. In tables, all fonts must have standard 14px size ('text-sm').`,
                  lineSnippet
                );
              }
            });
          });
        }
      }
    }
    import_typescript2.default.forEachChild(child, inspectCellDescendant);
  }
  if (node.children) {
    node.children.forEach(inspectCellDescendant);
  }
  if (config2.rules?.["table-no-cell-stacking"] !== "off") {
    if (hasVerticalStack || directBlockCount > 1) {
      if (!childrenText.includes("dse-ignore-stack")) {
        addViolation(
          filePath,
          pos.line,
          pos.col,
          "table-no-cell-stacking",
          "Stacked text or metadata items detected inside '<TableCell>'. In our design system, vertical stacking of metadata inside table rows is prohibited. Every piece of metadata must reside in its own dedicated column.",
          lineSnippet
        );
      }
    }
  }
  if (config2.rules?.["table-no-horizontal-stacking"] !== "off") {
    if (/(?:flex\s+items-center|inline-flex|flex-row|items-center\s+gap)/.test(childrenText) && /<(?:Chip|Badge)\b/.test(childrenText) && /<(?:span|div|p)\b[^>]*>(?:(?!<\/(?:span|div|p)>)[\s\S])*?(?:email|\.email|\{cEmail\}|\{item\.email\}|@)[^<]*?<\/(?:span|div|p)>/i.test(childrenText) && !childrenText.includes("dse-ignore-stack")) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "table-no-horizontal-stacking",
        "Horizontal stacking of primary text and metadata status chip detected inside '<TableCell>'. Distinct metadata must reside in dedicated columns.",
        lineSnippet
      );
    }
  }
}
function checkTableFileInvariants(filePath, content, addViolation, fileImports, hasTable, hasTableHeader, hasTableHead, hasTableBody, hasTableRow, hasTableCell, usesColumnHeader, usesResizeDivider, usesResizableHook, config2) {
  if (config2.rules?.["table-resizable-required"] !== "off") {
    const usesTablePrimitivesWithoutTable = (usesColumnHeader || usesResizeDivider || usesResizableHook) && !hasTable;
    if (usesTablePrimitivesWithoutTable) {
      addViolation(
        filePath,
        1,
        1,
        "table-resizable-required",
        "Ad-hoc div table detected. Constructing custom data grids without using the official '<Table>' suite is prohibited. Use <Table>, <TableHeader>, <TableHead>, <TableBody>, <TableRow>, and <TableCell>.",
        ""
      );
    }
  }
  if (hasTable && config2.rules?.["table-single-border"] !== "off") {
    if (/<div\b[^>]*\b(?:border\b|border-stroke|border-neutral)\b[^>]*>\s*<Table\b/.test(content)) {
      addViolation(
        filePath,
        1,
        1,
        "table-single-border",
        "Redundant outer border wrapper detected immediately surrounding '<Table>'. The '<Table>' component natively provides the official standard container. Remove redundant outer border wrapper.",
        ""
      );
    }
  }
  if (hasTable && config2.rules?.["table-windowed-pagination"] !== "off") {
    const normFilePath = filePath.replace(/\\/g, "/");
    const isExcludedFromPagination = normFilePath.includes("components/ui/table.tsx") || normFilePath.includes("components/settings/") || normFilePath.includes("app/(dashboard)/settings") || normFilePath.includes("lead-import-modal.tsx") || content.includes("dse-ignore-pagination");
    if (!isExcludedFromPagination) {
      const hasPagination = /paginate|safe[A-Z0-9_]*Page|currentPage|leadPage|sessionPage|campPage|total[A-Z0-9_]*Pages|pageSize|Dropdown[^>]*options=.*(?:10|25|50|100)/i.test(content) || /Showing\s+[\s\S]*?\bto\b[\s\S]*?\bof\b/i.test(content);
      if (!hasPagination) {
        addViolation(
          filePath,
          1,
          1,
          "table-windowed-pagination",
          "Data table in '<Table>' is missing windowed pagination controls. Tables rendering collections must support pagination with page size selector, Previous/Next buttons, and range indicator.",
          ""
        );
      }
    }
  }
}
function checkTabsElement(attributes, pos, filePath, addViolation, lineSnippet, fileImports) {
  const normPath = filePath.replace(/\\/g, "/");
  if (normPath.endsWith("components/ui/tabs.tsx")) return;
  if (!attributes.items) {
    addViolation(
      filePath,
      pos.line,
      pos.col,
      "tabs-component-required",
      "<Tabs> is missing mandatory 'items' prop. All Tabs components must provide an array of items [{ id, label, icon?, badge?, count?, disabled? }].",
      lineSnippet
    );
  }
}
function checkPseudoChips(tagName, attributes, pos, filePath, addViolation, lineSnippet, sourceFile) {
  const normPath = filePath.replace(/\\/g, "/");
  if (normPath.endsWith("components/ui/chip.tsx") || normPath.endsWith("components/ui/badge.tsx")) return;
  if (!attributes.className) return;
  const classStrings = extractClassNames(attributes.className.initializer, sourceFile);
  classStrings.forEach(({ text }) => {
    const tokens = text.split(/\s+/);
    const hasStaticBg = tokens.some((t) => /^(?:dark:)?bg-(?:neutral|emerald|amber|red|blue)-\d+/.test(t));
    const hasRadius = tokens.some((t) => /^(?:rounded-md|rounded-full)$/.test(t));
    const hasPadding = tokens.some((t) => /^(?:px-(?:1|1\.5|2|2\.5|3)|p-(?:0\.5|1))$/.test(t));
    if (hasStaticBg && hasRadius && hasPadding && !lineSnippet.includes("dse-ignore-chip")) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-pseudo-chips",
        `Pseudo-chip detected on '<${tagName}>'. Never use raw <span> or <div> elements styled with background fills and rounded corners to emulate chips. Use the standard '<Chip>' component.`,
        lineSnippet
      );
    }
  });
}
function checkElementClasses(node, tagName, attributes, pos, filePath, addViolation, sourceFile, config2) {
  if (!attributes.className) return;
  const isButton = ["Button", "IconButton", "ButtonyIcon", "FloatingActionButton"].includes(tagName);
  const isChip = ["Chip", "Badge", "Tag", "StatusBadge"].includes(tagName);
  const isTab = ["Tab", "TabTrigger", "TabsTrigger"].includes(tagName);
  const isCompactElement = isButton || isChip || isTab;
  const isCheckbox = tagName === "Checkbox" || attributes.type?.initializer?.getText(sourceFile)?.includes("checkbox") || attributes.role?.initializer?.getText(sourceFile)?.includes("checkbox") || Boolean(attributes["aria-checked"]) || attributes.className && /\b(?:size-5|w-5\s+h-5)\b/.test(attributes.className.rawText);
  const lineSnippet = sourceFile.getFullText().split("\n")[pos.line - 1] || "";
  const classStrings = extractClassNames(attributes.className.initializer, sourceFile);
  const normPath = filePath.replace(/\\/g, "/");
  const isPrimitivesFile = normPath.includes("components/ui/") || normPath.includes("lib/tokens.") || normPath.includes("tokens.") || (config2.tokens?.colors?.colorWhitelistPaths || []).some((wl) => normPath.includes(wl));
  const effectiveColorConfig = isPrimitivesFile ? { ...config2.tokens?.colors, disallowHardcodedColors: false } : config2.tokens?.colors;
  classStrings.forEach(({ text, node: stringNode }) => {
    const tokens = splitClassString(text);
    tokens.forEach((rawToken) => {
      const dec = decomposeToken(rawToken);
      if (!dec) return;
      const nodePos = stringNode ? getNodePosition(sourceFile, stringNode) : pos;
      const typoViolations = evaluateTypographyToken(dec.core, config2.tokens?.typography);
      typoViolations.forEach((v) => {
        if (config2.rules?.[v.rule] !== "off") {
          addViolation(filePath, nodePos.line, nodePos.col, v.rule, v.message, lineSnippet);
        }
      });
      const geoViolations = evaluateGeometryToken(dec.core, config2.tokens?.geometry, isCheckbox);
      geoViolations.forEach((v) => {
        if (config2.rules?.[v.rule] !== "off") {
          addViolation(filePath, nodePos.line, nodePos.col, v.rule, v.message, lineSnippet);
        }
      });
      const colorViolations = evaluateColorToken(dec.core, effectiveColorConfig);
      colorViolations.forEach((v) => {
        if (config2.rules?.[v.rule] !== "off") {
          addViolation(filePath, nodePos.line, nodePos.col, v.rule, v.message, lineSnippet);
        }
      });
      if (isButton && config2.rules?.["control-height-max"] !== "off") {
        if (/\bh-(?:10|11|12|14|16|\[(?:3[8-9]|[4-9][0-9]|[1-9][0-9]{2,})px\])\b/.test(dec.core)) {
          addViolation(
            filePath,
            nodePos.line,
            nodePos.col,
            "control-height-max",
            `Disallowed button height '${dec.core}'. Interactive buttons and controls must standardise on max 36px height ('h-[36px]' or 'h-9').`,
            lineSnippet
          );
        }
      }
      if (isCompactElement && config2.rules?.["no-wrapping-compact-elements"] !== "off") {
        if (dec.core === "flex-wrap" || dec.core === "whitespace-normal" || dec.core === "whitespace-pre-wrap") {
          addViolation(
            filePath,
            nodePos.line,
            nodePos.col,
            "no-wrapping-compact-elements",
            `Disallowed text wrapping class '${dec.core}' on <${tagName}>. Compact interactive elements (buttons, chips, badges, tabs) must never wrap text across multiple lines.`,
            lineSnippet
          );
        }
      }
    });
  });
  if (tagName === "TableHead" && config2.rules?.["no-wrapping-compact-elements"] !== "off") {
    const rawClass = attributes.className?.rawText || "";
    if (/\b(?:flex-wrap|whitespace-normal|whitespace-pre-wrap)\b/.test(rawClass)) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-wrapping-compact-elements",
        `Disallowed text wrapping on <TableHead>. Column headers must remain single-line ('whitespace-nowrap') to preserve table column alignment.`,
        lineSnippet
      );
    }
  }
}

// src/rules/regex-rules.ts
function runRegexRules(content, filePath, addViolation, config2) {
  const normPath = filePath.replace(/\\/g, "/");
  const isPrimitivesFile = normPath.includes("components/ui/") || normPath.includes("lib/tokens.") || normPath.includes("tokens.") || normPath.includes("globals.css") || normPath.includes("index.css") || (config2.tokens?.colors?.colorWhitelistPaths || []).some((wl) => normPath.includes(wl));
  const lines = content.split("\n");
  const unicodeArrowRegex = /[\u2190-\u2199\u21D0-\u21D9\u2794-\u27BF\u21B0-\u21B5\u27F5-\u27FF]|(?:->|<-)/gu;
  const hexColorRegex = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
  const backdropBlurRegex = /\bbackdrop-blur(?:-[a-z0-9]+)?\b/g;
  let inButtonTag = false;
  const disallowedButtonColorRegex = /(?:bg-(?:emerald|green|red|amber|rose|pink|purple|indigo)-[0-9]{2,3}|border-(?:emerald|green|red|amber|rose|pink|purple|indigo)-[0-9]{2,3})\b|variant=["'](?:danger|success|warning|error)["']/g;
  const buttonOpenRegex = /<(?:Button|IconButton|FloatingActionButton|ButtonyIcon)\b/g;
  const buttonCloseRegex = /<\/(?:Button|IconButton|FloatingActionButton|ButtonyIcon)>/g;
  const buttonSelfCloseRegex = /<(?:Button|IconButton|FloatingActionButton|ButtonyIcon)\b[^>]*\/>/g;
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();
    if (line.includes("dse-ignore") || trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*") || trimmed.startsWith("<!--")) {
      return;
    }
    const codeOnlyLine = line.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "");
    if (config2.rules?.["no-text-arrows"] !== "off") {
      unicodeArrowRegex.lastIndex = 0;
      let match;
      while ((match = unicodeArrowRegex.exec(codeOnlyLine)) !== null) {
        addViolation(
          filePath,
          lineNum,
          match.index + 1,
          "no-text-arrows",
          `Raw text/ASCII arrow '${match[0]}' detected. Disallowed in UI; use design system icon components instead.`,
          line
        );
      }
    }
    if (config2.rules?.["no-backdrop-blur"] !== "off") {
      if (!codeOnlyLine.includes("no-backdrop-blur")) {
        backdropBlurRegex.lastIndex = 0;
        let match;
        while ((match = backdropBlurRegex.exec(codeOnlyLine)) !== null) {
          addViolation(
            filePath,
            lineNum,
            match.index + 1,
            "no-backdrop-blur",
            `Disallowed backdrop blur '${match[0]}' detected. Backdrop blur is prohibited across the design system.`,
            line
          );
        }
      }
    }
    if (config2.rules?.["no-raw-hex-colors"] !== "off") {
      hexColorRegex.lastIndex = 0;
      let match;
      while ((match = hexColorRegex.exec(codeOnlyLine)) !== null) {
        const hex = match[0];
        if (!isPrimitivesFile && !codeOnlyLine.includes("svg") && !codeOnlyLine.includes("xmlns")) {
          addViolation(
            filePath,
            lineNum,
            match.index + 1,
            "no-raw-hex-colors",
            `Raw hex color '${hex}' detected. Use theme tokens or CSS variables instead of hardcoded hex values.`,
            line
          );
        }
      }
    }
    if (config2.rules?.["no-chip-colored-buttons"] !== "off") {
      buttonOpenRegex.lastIndex = 0;
      if (buttonOpenRegex.test(line)) {
        inButtonTag = true;
      }
      if (inButtonTag) {
        disallowedButtonColorRegex.lastIndex = 0;
        let match;
        while ((match = disallowedButtonColorRegex.exec(line)) !== null) {
          if (!line.includes("dse-ignore-button-color")) {
            addViolation(
              filePath,
              lineNum,
              match.index + 1,
              "no-chip-colored-buttons",
              `Disallowed chip color '${match[0]}' applied to Button. Buttons must never use semantic chip colors.`,
              line
            );
          }
        }
        buttonCloseRegex.lastIndex = 0;
        buttonSelfCloseRegex.lastIndex = 0;
        if (buttonCloseRegex.test(line) || buttonSelfCloseRegex.test(line) || line.includes(">")) {
          inButtonTag = false;
        }
      }
    }
  });
}

// src/rules/python-rules.ts
function isInsidePythonString(line, index) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < index; i++) {
    const char = line[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === "'" && !inDouble) inSingle = !inSingle;
    if (char === '"' && !inSingle) inDouble = !inDouble;
  }
  return inSingle || inDouble;
}
function runPythonRules(content, filePath, addViolation, config2) {
  const lines = content.split("\n");
  const isPython = filePath.endsWith(".py");
  const isCssOrHtml = filePath.endsWith(".css") || filePath.endsWith(".html") || filePath.endsWith(".jinja") || filePath.endsWith(".jinja2");
  const unicodeArrowRegex = /[\u2190-\u2199\u21D0-\u21D9\u2794-\u27BF\u21B0-\u21B5\u27F5-\u27FF]|(?:->|<-)/gu;
  const hexColorRegex = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
  let inStyleBlock = false;
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();
    if (line.includes("dse-ignore") || trimmed.startsWith("#") || trimmed.startsWith("//") || trimmed.startsWith("/*")) {
      return;
    }
    const codeOnlyLine = isPython ? line.replace(/#.*$/, "") : line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "");
    if (line.includes("<style>")) inStyleBlock = true;
    if (line.includes("</style>")) inStyleBlock = false;
    if (config2.rules?.["no-text-arrows"] !== "off") {
      unicodeArrowRegex.lastIndex = 0;
      let match;
      while ((match = unicodeArrowRegex.exec(codeOnlyLine)) !== null) {
        const arrow = match[0];
        if (isPython && arrow === "->" && !isInsidePythonString(line, match.index)) {
          continue;
        }
        addViolation(
          filePath,
          lineNum,
          match.index + 1,
          "no-text-arrows",
          `Raw text arrow '${arrow}' detected. Use design system icon components instead of raw arrows.`,
          line
        );
      }
    }
    if (inStyleBlock || isCssOrHtml) {
      const fontSizeMatch = line.match(/font-size\s*:\s*(\d+(?:\.\d+)?)(px|rem)/i);
      if (fontSizeMatch) {
        const val = parseFloat(fontSizeMatch[1]);
        const unit = fontSizeMatch[2].toLowerCase();
        const px = unit === "rem" ? val * 16 : val;
        if (px < 14 && config2.rules?.["font-size-min"] !== "off") {
          addViolation(
            filePath,
            lineNum,
            fontSizeMatch.index || 1,
            "font-size-min",
            `Disallowed font-size '${fontSizeMatch[0]}' (${px}px) is smaller than 14px. Primary body font must strictly be standard 14px.`,
            line
          );
        } else if (px > 32 && config2.rules?.["font-size-max"] !== "off") {
          addViolation(
            filePath,
            lineNum,
            fontSizeMatch.index || 1,
            "font-size-max",
            `Disallowed font-size '${fontSizeMatch[0]}' (${px}px) exceeds maximum allowed heading cap of 32px.`,
            line
          );
        }
      }
      const fontWeightMatch = line.match(/font-weight\s*:\s*([0-9]{3}|bold|bolder|semibold)/i);
      if (fontWeightMatch && config2.rules?.["font-weight-max"] !== "off") {
        const rawWeight = fontWeightMatch[1].toLowerCase();
        const weightNum = parseInt(rawWeight, 10);
        if (weightNum > 500 || ["bold", "bolder", "semibold"].includes(rawWeight)) {
          addViolation(
            filePath,
            lineNum,
            fontWeightMatch.index || 1,
            "font-weight-max",
            `Disallowed font-weight '${fontWeightMatch[0]}'. Font weight must not exceed Medium (500).`,
            line
          );
        }
      }
      if (config2.rules?.["no-backdrop-blur"] !== "off" && /backdrop-filter\s*:\s*blur/i.test(line)) {
        addViolation(
          filePath,
          lineNum,
          1,
          "no-backdrop-blur",
          "Disallowed backdrop blur filter detected in styles. Backdrop blur is prohibited across the design system.",
          line
        );
      }
    }
    if (config2.rules?.["no-raw-hex-colors"] !== "off") {
      hexColorRegex.lastIndex = 0;
      let match;
      while ((match = hexColorRegex.exec(line)) !== null) {
        const hex = match[0];
        if (inStyleBlock || isCssOrHtml || /(?:color|background|bg|border|fill|stroke|theme)\s*[:=]/i.test(line)) {
          addViolation(
            filePath,
            lineNum,
            match.index + 1,
            "no-raw-hex-colors",
            `Raw hex color '${hex}' detected. Centralize theme colors in configuration or CSS variables instead of hardcoded hex values.`,
            line
          );
        }
      }
    }
  });
}

// src/rules/runner.ts
async function runDseScan(config2, cwd = process.cwd()) {
  let targetDir = import_node_path4.default.resolve(cwd, config2.targetDir || "src");
  if (!import_node_fs4.default.existsSync(targetDir)) {
    targetDir = cwd;
  }
  const includePatterns = config2.include || ["**/*.{tsx,jsx,ts,js}"];
  const excludePatterns = config2.exclude || [
    "**/node_modules/**",
    "**/.next/**",
    "**/public/**",
    "**/.git/**"
  ];
  const inventoryCounts = {};
  const inventoryDef = config2.components?.requiredInventory || [];
  inventoryDef.forEach((comp) => {
    inventoryCounts[comp.name] = 0;
  });
  const rawFiles = await (0, import_fast_glob.default)(includePatterns, {
    cwd: targetDir,
    absolute: true
  });
  const files = rawFiles.filter((filePath) => {
    const relFromCwd = import_node_path4.default.relative(cwd, filePath).replace(/\\/g, "/");
    for (const pattern of excludePatterns) {
      const clean = pattern.replace(/^\*\*?\//, "").replace(/\/\*\*?$/, "").replace(/\\/g, "/");
      if (clean && (relFromCwd === clean || relFromCwd.startsWith(clean + "/") || relFromCwd.includes("/" + clean + "/") || relFromCwd.endsWith("/" + clean))) {
        return false;
      }
    }
    return true;
  });
  const violations = [];
  const seenViolationKeys = /* @__PURE__ */ new Set();
  const addViolation = (file, line, col, rule, message, snippet) => {
    const normFile = import_node_path4.default.relative(cwd, file).replace(/\\/g, "/");
    const key = `${normFile}:${line}:${rule}`;
    if (seenViolationKeys.has(key)) return;
    seenViolationKeys.add(key);
    const severity = config2.rules?.[rule] || "error";
    if (severity === "off") return;
    violations.push({
      file: normFile,
      line: line || 0,
      col: col || 0,
      rule,
      severity: severity === "warn" ? "warn" : "error",
      message,
      snippet: snippet ? snippet.trim() : void 0
    });
  };
  let scannedJsxFiles = false;
  for (const filePath of files) {
    const content = import_node_fs4.default.readFileSync(filePath, "utf-8");
    const isJsx = filePath.endsWith(".tsx") || filePath.endsWith(".jsx") || filePath.endsWith(".ts") || filePath.endsWith(".js");
    const isPythonOrTemplate = filePath.endsWith(".py") || filePath.endsWith(".html") || filePath.endsWith(".jinja") || filePath.endsWith(".jinja2") || filePath.endsWith(".css");
    if (isJsx) {
      scannedJsxFiles = true;
      inventoryDef.forEach((comp) => {
        const names = [comp.componentName || comp.name, ...comp.altNames || []];
        const pattern = new RegExp(`<(?:${names.join("|")})\\b`, "g");
        if (pattern.test(content)) {
          inventoryCounts[comp.name] = (inventoryCounts[comp.name] || 0) + 1;
        }
      });
      const sourceFile = parseTsx(filePath, content);
      const fileImports = getFileImports(sourceFile);
      runAstRules(sourceFile, filePath, addViolation, fileImports, config2);
      runRegexRules(content, filePath, addViolation, config2);
    } else if (isPythonOrTemplate) {
      runPythonRules(content, filePath, addViolation, config2);
    } else {
      runRegexRules(content, filePath, addViolation, config2);
    }
  }
  if (scannedJsxFiles && inventoryDef.length > 0 && config2.rules?.["component-inventory-active"] !== "off") {
    inventoryDef.forEach((comp) => {
      const count = inventoryCounts[comp.name] || 0;
      if (count === 0) {
        violations.push({
          file: "GLOBAL",
          line: 0,
          col: 0,
          rule: "component-inventory-active",
          severity: "error",
          message: `Required design system component '<${comp.name}>' is defined in the design system but never utilized anywhere across the application!`
        });
      }
    });
  }
  const errorCount = violations.filter((v) => v.severity === "error").length;
  const warningCount = violations.filter((v) => v.severity === "warn").length;
  const componentInventoryReport = {};
  if (scannedJsxFiles && inventoryDef.length > 0) {
    inventoryDef.forEach((comp) => {
      const count = inventoryCounts[comp.name] || 0;
      componentInventoryReport[comp.name] = {
        active: count > 0,
        fileCount: count
      };
    });
  }
  return {
    violations,
    scannedFilesCount: files.length,
    errorCount,
    warningCount,
    componentInventory: componentInventoryReport
  };
}

// src/doctor/index.ts
function computeDoctorScore(result) {
  const categoryViolations = {
    typography: 0,
    geometry: 0,
    components: 0,
    colors: 0,
    wrapping: 0,
    tables: 0
  };
  const fileCountMap = {};
  result.violations.forEach((v) => {
    fileCountMap[v.file] = (fileCountMap[v.file] || 0) + 1;
    if (v.rule.startsWith("font-") || v.rule.includes("text-size") || v.rule.includes("uppercase")) {
      categoryViolations.typography++;
    } else if (v.rule.includes("wrapping")) {
      categoryViolations.wrapping++;
    } else if (v.rule.startsWith("control-") || v.rule.startsWith("corner-radius")) {
      categoryViolations.geometry++;
    } else if (v.rule.includes("color") || v.rule.includes("gradient") || v.rule.includes("blur")) {
      categoryViolations.colors++;
    } else if (v.rule.startsWith("table-")) {
      categoryViolations.tables++;
    } else {
      categoryViolations.components++;
    }
  });
  const filesCount = Math.max(1, result.scannedFilesCount || 1);
  function calcScore(violations) {
    const penaltyPerViolation = 100 / (filesCount * 2);
    return Math.max(0, Math.round(100 - violations * penaltyPerViolation));
  }
  const categories = [
    { name: "Typography Scale", category: "typography", violations: categoryViolations.typography, score: calcScore(categoryViolations.typography) },
    { name: "Geometry & Radii", category: "geometry", violations: categoryViolations.geometry, score: calcScore(categoryViolations.geometry) },
    { name: "Wrap Integrity", category: "wrapping", violations: categoryViolations.wrapping, score: calcScore(categoryViolations.wrapping) },
    { name: "Component Inventory", category: "components", violations: categoryViolations.components, score: calcScore(categoryViolations.components) },
    { name: "Color Purity", category: "colors", violations: categoryViolations.colors, score: calcScore(categoryViolations.colors) },
    { name: "Table Invariants", category: "tables", violations: categoryViolations.tables, score: calcScore(categoryViolations.tables) }
  ];
  const totalScore = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);
  let grade = "F";
  if (totalScore >= 98) grade = "A+";
  else if (totalScore >= 90) grade = "A";
  else if (totalScore >= 80) grade = "B";
  else if (totalScore >= 70) grade = "C";
  else if (totalScore >= 60) grade = "D";
  const fileBreakdown = Object.entries(fileCountMap).map(([file, violations]) => ({ file, violations })).sort((a, b) => b.violations - a.violations).slice(0, 5);
  return {
    overallScore: totalScore,
    grade,
    scannedFiles: filesCount,
    totalViolations: result.violations.length,
    categories,
    fileBreakdown
  };
}

// src/fixer/index.ts
var import_node_fs5 = __toESM(require("fs"), 1);
var import_node_path5 = __toESM(require("path"), 1);
async function runDseFix(config2, cwd = process.cwd()) {
  const scanResult = await runDseScan(config2, cwd);
  const violationsByFile = {};
  scanResult.violations.forEach((v) => {
    if (!violationsByFile[v.file]) {
      violationsByFile[v.file] = [];
    }
    violationsByFile[v.file].push(v);
  });
  const details = [];
  let totalModifications = 0;
  for (const [relPath, violations] of Object.entries(violationsByFile)) {
    const fullPath = import_node_path5.default.resolve(cwd, relPath);
    if (!import_node_fs5.default.existsSync(fullPath)) continue;
    let content = import_node_fs5.default.readFileSync(fullPath, "utf-8");
    const originalContent = content;
    const fileFixes = [];
    if (violations.some((v) => v.rule === "no-wrapping-compact-elements")) {
      const before = content;
      content = content.replace(/(<(?:Button|IconButton|Chip|Badge)\b[^>]*className=["'`][^"'`]*?)\b(?:whitespace-normal|whitespace-pre-wrap|flex-wrap)\b([^"'`]*?["'`])/g, (match, prefix, suffix) => {
        return `${prefix}whitespace-nowrap shrink-0${suffix}`;
      });
      if (before !== content) {
        fileFixes.push("Replaced wrapping classes with 'whitespace-nowrap shrink-0' on compact controls");
      }
    }
    if (violations.some((v) => v.rule === "no-raw-html-elements" && v.message.includes("<button>"))) {
      const before = content;
      content = content.replace(/<button(\s|>)/g, "<Button$1");
      content = content.replace(/<\/button>/g, "</Button>");
      if (before !== content) {
        if (!content.includes("import { Button }") && !content.includes("import Button") && !relPath.includes("components/ui/button")) {
          content = `import { Button } from "@/components/ui/button";
` + content;
        }
        fileFixes.push("Upgraded raw <button> to <Button>");
      }
    }
    if (violations.some((v) => v.rule === "no-raw-html-elements" && v.message.includes("<select>"))) {
      const before = content;
      content = content.replace(/<select(\s|>)/g, "<Dropdown$1");
      content = content.replace(/<\/select>/g, "</Dropdown>");
      if (before !== content) {
        if (!content.includes("import { Dropdown }") && !content.includes("import Dropdown") && !relPath.includes("components/ui/dropdown")) {
          content = `import { Dropdown } from "@/components/ui/dropdown";
` + content;
        }
        fileFixes.push("Upgraded raw <select> to <Dropdown>");
      }
    }
    if (violations.some((v) => v.rule === "no-raw-html-elements" && v.message.includes("<textarea>"))) {
      const before = content;
      content = content.replace(/<textarea(\s|>)/g, "<Textarea$1");
      content = content.replace(/<\/textarea>/g, "</Textarea>");
      if (before !== content) {
        if (!content.includes("import { Textarea }") && !content.includes("import Textarea") && !relPath.includes("components/ui/textarea")) {
          content = `import { Textarea } from "@/components/ui/textarea";
` + content;
        }
        fileFixes.push("Upgraded raw <textarea> to <Textarea>");
      }
    }
    if (violations.some((v) => v.rule === "no-arbitrary-text-size")) {
      const before = content;
      content = content.replace(/\btext-\[(?:13|13\.5|14|14\.5|15|15\.5)px\]\b/g, "text-sm");
      content = content.replace(/\btext-\[(?:11|11\.5|12|12\.5)px\]\b/g, "text-xs");
      content = content.replace(/\btext-\[(?:16|17)px\]\b/g, "text-base");
      if (before !== content) {
        fileFixes.push("Standardized arbitrary font sizes to compliant token scales");
      }
    }
    if (violations.some((v) => v.rule === "no-backdrop-blur")) {
      const before = content;
      content = content.replace(/\bbackdrop-blur(?:-(?:none|sm|md|lg|xl|2xl|3xl))?\b/g, "");
      if (before !== content) {
        fileFixes.push("Removed non-compliant backdrop-blur classes");
      }
    }
    if (content !== originalContent) {
      import_node_fs5.default.writeFileSync(fullPath, content, "utf-8");
      totalModifications += fileFixes.length;
      details.push({
        file: relPath,
        fixes: fileFixes
      });
    }
  }
  return {
    filesFixed: details.length,
    totalModifications,
    details
  };
}

// src/guardrails/index.ts
var import_node_fs6 = __toESM(require("fs"), 1);
var import_node_path6 = __toESM(require("path"), 1);
function generateAgentInstructions(config2) {
  const allowedRadii = config2.tokens?.geometry?.allowedRadii?.join(", ") || "0px, 8px, 12px, 16px, 9999px";
  const maxControlHeight = config2.tokens?.geometry?.maxControlHeight || 36;
  const bannedColors = config2.tokens?.colors?.bannedColorFamilies?.join(", ") || "slate, gray, zinc, stone, etc.";
  return `<!-- BEGIN:DSE-AGENT-RULES -->
# DESIGN SYSTEM ENFORCER (DSE) - MANDATORY RULES

You MUST adhere to these design system invariants for all UI generation:

1. COMPONENT INVARIANTS:
   - NEVER use raw HTML: <button>, <select>, <textarea>, <table>, <input type="checkbox">, <input type="radio">.
   - ALWAYS use standard primitives: <Button>, <Dropdown>, <Textarea>, <Table>, <Checkbox>, <Chip>.
   - Never create pseudo-chips using raw <div> or <span> with background fills and borders. Use <Chip>.

2. WRAP INTEGRITY (COMPACT ELEMENTS):
   - Interactive compact elements (<Button>, <Chip>, <Badge>, <TableHead>, tabs) MUST NOT wrap text.
   - ALWAYS include 'whitespace-nowrap shrink-0' on compact interactive components.

3. GEOMETRY & RADII:
   - Standard control height for buttons and inputs is strictly max ${maxControlHeight}px ('h-[36px]' or 'h-9').
   - Allowed corner radii tokens: ${allowedRadii}. Never use random arbitrary radii.

4. COLOR SCALE & PURITY:
   - Strictly neutral palette for base surfaces and borders ('neutral-100' through 'neutral-900').
   - Banned arbitrary color families: ${bannedColors}.
   - Never use arbitrary inline hex colors ('#1a2b3c') in utility classes. Use design system CSS variables ('var(--primary)').

5. BEFORE FINISHING UI EDITS:
   - Run 'npx dse check' to verify zero design system violations.
<!-- END:DSE-AGENT-RULES -->
`;
}
function installPreCommitHook(cwd = process.cwd()) {
  const gitDir = import_node_path6.default.resolve(cwd, ".git");
  if (!import_node_fs6.default.existsSync(gitDir)) {
    throw new Error("No .git repository found in this directory.");
  }
  const hooksDir = import_node_path6.default.resolve(gitDir, "hooks");
  if (!import_node_fs6.default.existsSync(hooksDir)) {
    import_node_fs6.default.mkdirSync(hooksDir, { recursive: true });
  }
  const hookPath = import_node_path6.default.resolve(hooksDir, "pre-commit");
  const hookScript = `#!/usr/bin/env sh
# Design System Enforcer (DSE) Pre-Commit Hook
echo "
\u{1F50D} Running Design System Enforcer pre-commit check..."

if command -v npx >/dev/null 2>&1; then
  npx dse check --strict
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "
\u274C Commit rejected: Design System violations found."
    echo "\u{1F4A1} Run 'npx dse fix' or 'npx dse check' to review issues.
"
    exit 1
  fi
fi
`;
  import_node_fs6.default.writeFileSync(hookPath, hookScript, { mode: 493 });
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DesignSystemRuntimeError,
  DseGuard,
  assertValidStyles,
  computeDoctorScore,
  defineConfig,
  detectProject,
  dseAstroPlugin,
  generateAgentInstructions,
  installPreCommitHook,
  loadConfig,
  runDseFix,
  runDseScan
});
//# sourceMappingURL=index.cjs.map