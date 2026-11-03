#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/cli.ts
var import_node_fs8 = __toESM(require("fs"), 1);
var import_node_path8 = __toESM(require("path"), 1);
var import_commander = require("commander");
var import_picocolors3 = __toESM(require("picocolors"), 1);

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
      disallowSaturatedGradients: true
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
    "no-wrapping-compact-elements": "error"
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
function evaluateTypographyToken(core, config) {
  const violations = [];
  const minFont = config?.minFontSize || "14px";
  const maxFont = config?.maxFontSize || "32px";
  const maxWeight = config?.maxFontWeight ?? 500;
  const disallowArbitrary = config?.disallowArbitrarySizes ?? true;
  const disallowUppercase = config?.disallowUppercase ?? true;
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
function evaluateGeometryToken(core, config, isCheckbox = false) {
  const violations = [];
  const allowedRadii = new Set(config?.allowedRadii || ["0", "0px", "8px", "12px", "16px", "9999px", "100%"]);
  const checkboxRadii = new Set(config?.radiiExceptions?.Checkbox || ["0", "0px", "4px", "0.25rem", "8px", "12px", "16px", "9999px", "100%"]);
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
function evaluateColorToken(core, config) {
  const violations = [];
  const bannedFamilies = new Set(config?.bannedColorFamilies || []);
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
  if (config?.disallowSaturatedGradients) {
    if (core === "bg-clip-text" || core === "text-transparent") {
      violations.push({
        rule: "no-unapproved-gradients",
        message: `Gradient text styling '${core}' detected. Cheesy AI gradient text is prohibited. Use standard high-contrast text typography.`
      });
    }
  }
  return violations;
}

// src/rules/ast-rules.ts
function runAstRules(sourceFile, filePath, addViolation, fileImports, config) {
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
      if (config.rules?.["no-raw-html-elements"] !== "off") {
        checkRawHtmlElements(tagName, attributes, pos, filePath, addViolation, lineSnippet, config);
      }
      checkButtonInvariants(tagName, attributes, pos, filePath, addViolation, lineSnippet, config);
      if (tagName === "TableHead") {
        checkTableHeadInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config);
      }
      if (tagName === "TableBody" && config.rules?.["table-no-divide-y"] !== "off") {
        checkTableBodyInvariants(attributes, pos, filePath, addViolation, lineSnippet, sourceFile);
      }
      if (tagName === "TableCell") {
        checkTableCellInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config);
      }
      if (tagName === "Tabs" && config.rules?.["tabs-component-required"] !== "off") {
        checkTabsElement(attributes, pos, filePath, addViolation, lineSnippet, fileImports);
      }
      if ((tagName === "span" || tagName === "div") && config.rules?.["no-pseudo-chips"] !== "off") {
        checkPseudoChips(tagName, attributes, pos, filePath, addViolation, lineSnippet, sourceFile);
      }
      checkElementClasses(node, tagName, attributes, pos, filePath, addViolation, sourceFile, config);
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
    config
  );
}
function checkRawHtmlElements(tagName, attributes, pos, filePath, addViolation, lineSnippet, config) {
  if (tagName[0] !== tagName[0].toLowerCase()) {
    return;
  }
  const replacements = config.components?.disallowRawHtml || {};
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
    } else if (typeVal === "file") {
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
function checkButtonInvariants(tagName, attributes, pos, filePath, addViolation, lineSnippet, config) {
  const isButton = ["Button", "IconButton", "ButtonyIcon", "FloatingActionButton"].includes(tagName);
  if (!isButton) return;
  if (config.rules?.["no-chip-colored-buttons"] !== "off" && attributes.variant && attributes.variant.initializer) {
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
function checkTableHeadInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config) {
  const hasIconProp = Boolean(attributes.icon);
  const rawChildren = node.getText(sourceFile);
  const isCheckboxCol = /<(?:Checkbox\b|input[^>]*type=["']checkbox["'])/i.test(rawChildren) || /toggleSelect/i.test(rawChildren) || /selectedEmails|selectedIds|selectedLeadIds/i.test(rawChildren) || attributes.resizable?.initializer?.getText(sourceFile) === "{false}" && /checkbox/i.test(rawChildren);
  if (config.rules?.["table-head-icon-required"] !== "off" && !hasIconProp && !isCheckboxCol) {
    addViolation(
      filePath,
      pos.line,
      pos.col,
      "table-head-icon-required",
      "<TableHead> is missing mandatory 'icon' prop (e.g. icon={<SomeIcon size={20} />}). All table headers must provide an icon component via the 'icon' prop.",
      lineSnippet
    );
  }
  if (config.rules?.["table-resizable-required"] !== "off" && attributes.resizable && attributes.resizable.initializer) {
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
  if (config.rules?.["table-no-horizontal-stacking"] !== "off") {
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
function checkTableCellInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config) {
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
      if (config.rules?.["table-uniform-typography"] !== "off") {
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
  if (config.rules?.["table-no-cell-stacking"] !== "off") {
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
  if (config.rules?.["table-no-horizontal-stacking"] !== "off") {
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
function checkTableFileInvariants(filePath, content, addViolation, fileImports, hasTable, hasTableHeader, hasTableHead, hasTableBody, hasTableRow, hasTableCell, usesColumnHeader, usesResizeDivider, usesResizableHook, config) {
  if (config.rules?.["table-resizable-required"] !== "off") {
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
  if (hasTable && config.rules?.["table-single-border"] !== "off") {
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
  if (hasTable && config.rules?.["table-windowed-pagination"] !== "off") {
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
function checkElementClasses(node, tagName, attributes, pos, filePath, addViolation, sourceFile, config) {
  if (!attributes.className) return;
  const isButton = ["Button", "IconButton", "ButtonyIcon", "FloatingActionButton"].includes(tagName);
  const isChip = ["Chip", "Badge", "Tag", "StatusBadge"].includes(tagName);
  const isTab = ["Tab", "TabTrigger", "TabsTrigger"].includes(tagName);
  const isCompactElement = isButton || isChip || isTab;
  const isCheckbox = tagName === "Checkbox" || attributes.type?.initializer?.getText(sourceFile)?.includes("checkbox") || attributes.role?.initializer?.getText(sourceFile)?.includes("checkbox") || Boolean(attributes["aria-checked"]) || attributes.className && /\b(?:size-5|w-5\s+h-5)\b/.test(attributes.className.rawText);
  const lineSnippet = sourceFile.getFullText().split("\n")[pos.line - 1] || "";
  const classStrings = extractClassNames(attributes.className.initializer, sourceFile);
  classStrings.forEach(({ text, node: stringNode }) => {
    const tokens = splitClassString(text);
    tokens.forEach((rawToken) => {
      const dec = decomposeToken(rawToken);
      if (!dec) return;
      const nodePos = stringNode ? getNodePosition(sourceFile, stringNode) : pos;
      const typoViolations = evaluateTypographyToken(dec.core, config.tokens?.typography);
      typoViolations.forEach((v) => {
        if (config.rules?.[v.rule] !== "off") {
          addViolation(filePath, nodePos.line, nodePos.col, v.rule, v.message, lineSnippet);
        }
      });
      const geoViolations = evaluateGeometryToken(dec.core, config.tokens?.geometry, isCheckbox);
      geoViolations.forEach((v) => {
        if (config.rules?.[v.rule] !== "off") {
          addViolation(filePath, nodePos.line, nodePos.col, v.rule, v.message, lineSnippet);
        }
      });
      const colorViolations = evaluateColorToken(dec.core, config.tokens?.colors);
      colorViolations.forEach((v) => {
        if (config.rules?.[v.rule] !== "off") {
          addViolation(filePath, nodePos.line, nodePos.col, v.rule, v.message, lineSnippet);
        }
      });
      if (isButton && config.rules?.["control-height-max"] !== "off") {
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
      if (isCompactElement && config.rules?.["no-wrapping-compact-elements"] !== "off") {
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
  if (tagName === "TableHead" && config.rules?.["no-wrapping-compact-elements"] !== "off") {
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
function runRegexRules(content, filePath, addViolation, config) {
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
    if (config.rules?.["no-text-arrows"] !== "off") {
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
    if (config.rules?.["no-backdrop-blur"] !== "off") {
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
    if (config.rules?.["no-raw-hex-colors"] !== "off") {
      hexColorRegex.lastIndex = 0;
      let match;
      while ((match = hexColorRegex.exec(codeOnlyLine)) !== null) {
        const hex = match[0];
        if (!codeOnlyLine.includes("svg") && !codeOnlyLine.includes("xmlns")) {
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
    if (config.rules?.["no-chip-colored-buttons"] !== "off") {
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
function runPythonRules(content, filePath, addViolation, config) {
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
    if (config.rules?.["no-text-arrows"] !== "off") {
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
        if (px < 14 && config.rules?.["font-size-min"] !== "off") {
          addViolation(
            filePath,
            lineNum,
            fontSizeMatch.index || 1,
            "font-size-min",
            `Disallowed font-size '${fontSizeMatch[0]}' (${px}px) is smaller than 14px. Primary body font must strictly be standard 14px.`,
            line
          );
        } else if (px > 32 && config.rules?.["font-size-max"] !== "off") {
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
      if (fontWeightMatch && config.rules?.["font-weight-max"] !== "off") {
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
      if (config.rules?.["no-backdrop-blur"] !== "off" && /backdrop-filter\s*:\s*blur/i.test(line)) {
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
    if (config.rules?.["no-raw-hex-colors"] !== "off") {
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
async function runDseScan(config, cwd = process.cwd()) {
  let targetDir = import_node_path4.default.resolve(cwd, config.targetDir || "src");
  if (!import_node_fs4.default.existsSync(targetDir)) {
    targetDir = cwd;
  }
  const includePatterns = config.include || ["**/*.{tsx,jsx,ts,js}"];
  const excludePatterns = config.exclude || [
    "**/node_modules/**",
    "**/.next/**",
    "**/public/**",
    "**/.git/**"
  ];
  const inventoryCounts = {};
  const inventoryDef = config.components?.requiredInventory || [];
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
    const severity = config.rules?.[rule] || "error";
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
      runAstRules(sourceFile, filePath, addViolation, fileImports, config);
      runRegexRules(content, filePath, addViolation, config);
    } else if (isPythonOrTemplate) {
      runPythonRules(content, filePath, addViolation, config);
    } else {
      runRegexRules(content, filePath, addViolation, config);
    }
  }
  if (scannedJsxFiles && inventoryDef.length > 0 && config.rules?.["component-inventory-active"] !== "off") {
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

// src/formatters/stylish.ts
var import_picocolors = __toESM(require("picocolors"), 1);
function formatStylish(result) {
  const output = [];
  output.push("");
  output.push(import_picocolors.default.bold(import_picocolors.default.cyan("========================================================")));
  output.push(import_picocolors.default.bold(import_picocolors.default.cyan("       DESIGN SYSTEM ENFORCER (DSE) - SCAN REPORT       ")));
  output.push(import_picocolors.default.bold(import_picocolors.default.cyan("========================================================")));
  output.push(`Scanned ${import_picocolors.default.bold(result.scannedFilesCount)} files.`);
  output.push("");
  if (Object.keys(result.componentInventory).length > 0) {
    output.push(import_picocolors.default.bold(import_picocolors.default.dim("--- Design System Components Inventory ---")));
    for (const [name, info] of Object.entries(result.componentInventory)) {
      const paddedName = `<${name}`.padEnd(22) + ">";
      if (info.active) {
        output.push(`  \u2022 ${import_picocolors.default.white(paddedName)} : ${import_picocolors.default.green("\u2714 active")} (${info.fileCount} files)`);
      } else {
        output.push(`  \u2022 ${import_picocolors.default.white(paddedName)} : ${import_picocolors.default.red("\u2716 UNUSED / DEAD COMPONENT")}`);
      }
    }
    output.push("");
  }
  if (result.violations.length > 0) {
    output.push(import_picocolors.default.bold(import_picocolors.default.red(`Found ${result.errorCount} error(s) and ${result.warningCount} warning(s):`)));
    output.push("");
    const grouped = {};
    for (const v of result.violations) {
      if (!grouped[v.file]) grouped[v.file] = [];
      grouped[v.file].push(v);
    }
    for (const [file, items] of Object.entries(grouped)) {
      output.push(import_picocolors.default.underline(import_picocolors.default.bold(file)));
      for (const item of items) {
        const badge = item.severity === "error" ? import_picocolors.default.red("error") : import_picocolors.default.yellow("warning");
        output.push(
          `  ${import_picocolors.default.dim(`${item.line}:${item.col}`)}  ${badge}  ${item.message}  ${import_picocolors.default.dim(`(${item.rule})`)}`
        );
        if (item.snippet) {
          output.push(`    ${import_picocolors.default.dim(">")} ${import_picocolors.default.italic(item.snippet)}`);
        }
      }
      output.push("");
    }
    output.push(
      import_picocolors.default.bold(
        import_picocolors.default.red(
          `\u2716 Failed with ${result.errorCount} error(s). Please resolve all Design System Enforcer violations before committing or deploying.`
        )
      )
    );
  } else {
    output.push(import_picocolors.default.bold(import_picocolors.default.green("\u2714 PERFECT! All files strictly comply with the Design System Enforcer rules.")));
  }
  output.push("");
  return output.join("\n");
}

// src/formatters/json.ts
function formatJson(result) {
  return JSON.stringify(result, null, 2);
}

// src/scaffold/index.ts
var import_node_fs5 = __toESM(require("fs"), 1);
var import_node_path5 = __toESM(require("path"), 1);

// src/scaffold/templates/tokens.ts
var tokensTemplate = `/**
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

// src/scaffold/templates/css.ts
var cssTemplate = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* -------------------------------------------------------------------------
     * Design System Color Tokens (HSL)
     * Tip for AI Agents: Modify HSL values here to rebrand or customize themes!
     * ------------------------------------------------------------------------- */
    --background: 0 0% 100%;             /* White (#ffffff) */
    --foreground: 0 0% 11%;              /* Text Primary (#1c1c1c) */

    --muted: 0 0% 96%;                   /* Neutral 100 (#f5f5f5) */
    --muted-foreground: 0 0% 45%;        /* Text Secondary (#737373) */

    --border: 0 0% 90%;                  /* Stroke Default (#e5e5e5) */
    --input: 0 0% 90%;                   /* Input Stroke */

    --primary: 0 0% 9%;                  /* Brand Dark (#171717) */
    --primary-foreground: 0 0% 98%;

    --secondary: 0 0% 96%;
    --secondary-foreground: 0 0% 9%;

    --accent: 0 0% 96%;
    --accent-foreground: 0 0% 9%;

    /* Semantic Status Tokens */
    --success: 142 71% 45%;              /* Emerald */
    --success-foreground: 0 0% 100%;

    --warning: 38 92% 50%;               /* Amber */
    --warning-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;            /* Red */
    --destructive-foreground: 0 0% 100%;

    /* Geometry Tokens */
    --radius-sm: 8px;
    --radius-md: 8px;                    /* Standard 8px for controls */
    --radius-lg: 12px;                   /* Standard 12px for cards */
    --control-height: 36px;              /* Standard 36px */
  }

  .dark {
    --background: 0 0% 9%;
    --foreground: 0 0% 98%;

    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 64%;

    --border: 0 0% 20%;
    --input: 0 0% 20%;

    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;

    --secondary: 0 0% 15%;
    --secondary-foreground: 0 0% 98%;

    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 98%;
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-size: 14px;
    line-height: 1.5;
  }
}
`;

// src/scaffold/templates/components.ts
var buttonTemplate = `import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", children, ...props }, ref) => {
    // Standard 36px height, 8px radius, font-medium, strictly neutral palette
    const baseClasses =
      "inline-flex items-center justify-center font-medium text-sm rounded-md whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";


    const variantClasses = {
      primary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-2xs",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
      outline: "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 shadow-2xs",
      ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
    }[variant];

    const sizeClasses = {
      default: "h-[36px] min-h-[36px] px-3.5 gap-2",
      sm: "h-[30px] min-h-[30px] px-2.5 text-sm gap-1.5",
      icon: "size-9 min-h-[36px] min-w-[36px] p-0",
    }[size];

    return (
      <button ref={ref} className={\`\${baseClasses} \${variantClasses} \${sizeClasses} \${className}\`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
`;
var chipTemplate = `import React from "react";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "neutral" | "success" | "warning" | "error" | "outline";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  variant = "neutral",
  icon,
  children,
  className = "",
  ...props
}) => {
  // Standard 36px height, 8px radius, 14px typography
  const baseClasses =
    "inline-flex items-center h-[36px] min-h-[36px] px-3 rounded-md text-sm font-medium whitespace-nowrap shrink-0 gap-1.5 select-none";


  const variantClasses = {
    neutral: "bg-neutral-100 text-neutral-800 border border-neutral-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-red-50 text-red-700 border border-red-200",
    outline: "bg-white text-neutral-700 border border-neutral-200",
  }[variant];

  return (
    <div className={\`\${baseClasses} \${variantClasses} \${className}\`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
`;
var inputTemplate = `import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, type = "text", ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && <div className="absolute left-3 text-neutral-400 pointer-events-none">{icon}</div>}
        <input
          ref={ref}
          type={type}
          className={\`w-full h-[36px] min-h-[36px] \${icon ? "pl-9" : "px-3"} pr-3 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors disabled:opacity-50 \${className}\`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
`;
var dropdownTemplate = `import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={\`relative inline-block w-full min-w-[140px] \${className}\`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[36px] min-h-[36px] px-3 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 flex items-center justify-between gap-2 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50"
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-60 overflow-y-auto py-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                onChange?.(option.value);
                setIsOpen(false);
              }}
              className={\`w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-neutral-100 transition-colors \${option.value === value ? "bg-neutral-50 font-medium text-neutral-900" : "text-neutral-700"} \${option.disabled ? "opacity-50 cursor-not-allowed" : ""}\`}
            >
              {option.icon}
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
`;
var tableTemplate = `import React from "react";

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div className="w-full rounded-md border border-neutral-200 bg-white shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table ref={ref} className={\`w-full text-sm text-left border-collapse \${className}\`} {...props}>
          {children}
        </table>
      </div>
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", children, ...props }, ref) => (
    <thead ref={ref} className={\`bg-neutral-50/80 border-b border-neutral-200 text-neutral-900 font-medium \${className}\`} {...props}>
      {children}
    </thead>
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", children, ...props }, ref) => (
    <tbody ref={ref} className={\`divide-none bg-white \${className}\`} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = "", children, ...props }, ref) => (
    <tr ref={ref} className={\`border-b border-neutral-200 transition-colors hover:bg-neutral-50/60 last:border-b-0 \${className}\`} {...props}>
      {children}
    </tr>
  )
);
TableRow.displayName = "TableRow";

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  icon?: React.ReactNode;
  resizable?: boolean;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className = "", icon, resizable = true, children, ...props }, ref) => (
    <th
      ref={ref}
      className={\`h-[36px] px-4 text-left font-medium text-sm text-neutral-900 select-none align-middle relative whitespace-nowrap \${className}\`}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-neutral-500 shrink-0">{icon}</span>}
        <span className="whitespace-nowrap">{children}</span>
      </div>
    </th>
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <td ref={ref} className={\`px-4 py-2.5 align-middle text-sm text-neutral-900 \${className}\`} {...props}>
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";
`;
var tabsTemplate = `import React from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className = "" }) => {
  // Standard 36px height, 8px radius, font-medium
  return (
    <div className={\`inline-flex h-[36px] min-h-[36px] items-center rounded-md bg-neutral-100 p-1 text-neutral-600 \${className}\`}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={\`inline-flex h-[28px] items-center justify-center gap-1.5 rounded-sm px-3 text-sm font-medium whitespace-nowrap shrink-0 transition-all select-none \${
              isActive
                ? "bg-white text-neutral-900 shadow-2xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50"
            } \${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}\`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                {tab.count}
              </span>
            )}
            {tab.badge}
          </button>
        );
      })}
    </div>
  );
};
`;
var cardTemplate = `import React from "react";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    // Standard 12px corner radius (rounded-lg) for main content cards and containers
    <div
      ref={ref}
      className={\`rounded-lg border border-neutral-200 bg-white p-5 shadow-xs text-neutral-900 \${className}\`}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";
`;
var checkboxTemplate = `import React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, id, ...props }, ref) => {
    return (
      <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          // Strictly 20px (size-5) and 4px radius (rounded-xs / rounded-[4px])
          className={\`size-5 rounded-xs border border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 transition-colors cursor-pointer \${className}\`}
          {...props}
        />
        {label && <span className="text-sm font-medium text-neutral-900">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
`;
var skeletonTemplate = `import React from "react";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <div
      className={\`animate-pulse rounded-md bg-neutral-200/70 \${className}\`}
      {...props}
    />
  );
};
`;

// src/scaffold/index.ts
var COMPONENT_TEMPLATES = {
  button: { filename: "button.tsx", content: buttonTemplate },
  chip: { filename: "chip.tsx", content: chipTemplate },
  badge: { filename: "badge.tsx", content: chipTemplate },
  input: { filename: "input.tsx", content: inputTemplate },
  dropdown: { filename: "dropdown.tsx", content: dropdownTemplate },
  table: { filename: "table.tsx", content: tableTemplate },
  tabs: { filename: "tabs.tsx", content: tabsTemplate },
  card: { filename: "card.tsx", content: cardTemplate },
  checkbox: { filename: "checkbox.tsx", content: checkboxTemplate },
  skeleton: { filename: "skeleton.tsx", content: skeletonTemplate }
};
function scaffoldConfig(cwd = process.cwd(), preset = "berserk") {
  if (preset === "python") {
    const jsonPath = import_node_path5.default.resolve(cwd, "dse.config.json");
    if (import_node_fs5.default.existsSync(jsonPath)) return jsonPath;
    const content2 = JSON.stringify(
      {
        preset: "python",
        targetDir: ".",
        include: ["**/*.{py,html,jinja,jinja2,css}"],
        exclude: [
          "**/.venv/**",
          "**/venv/**",
          "**/__pycache__/**",
          "**/.pytest_cache/**",
          "**/.git/**"
        ]
      },
      null,
      2
    ) + "\n";
    import_node_fs5.default.writeFileSync(jsonPath, content2, "utf-8");
    return jsonPath;
  }
  const configPath = import_node_path5.default.resolve(cwd, "dse.config.js");
  if (import_node_fs5.default.existsSync(configPath)) {
    return configPath;
  }
  const content = `import { defineConfig } from "design-system-enforcer";

export default defineConfig({
  preset: "${preset}",
  targetDir: "src",
  include: ["**/*.{tsx,jsx,ts,js}"],
  exclude: [
    "**/node_modules/**",
    "**/.next/**",
    "**/public/**",
    "**/.git/**",
    "src/lib/tokens.ts",
    "src/app/globals.css",
    "src/components/ui/button.tsx",
    "src/components/ui/chip.tsx",
    "src/components/ui/card.tsx",
    "src/components/ui/input.tsx",
    "src/components/ui/table.tsx",
    "src/components/ui/tabs.tsx",
    "src/components/ui/dropdown.tsx",
    "src/components/ui/checkbox.tsx",
    "src/components/ui/skeleton.tsx",
  ],
});
`;
  import_node_fs5.default.writeFileSync(configPath, content, "utf-8");
  return configPath;
}
function scaffoldTokens(cwd = process.cwd()) {
  const libDir = import_node_path5.default.resolve(cwd, "src/lib");
  const appDir = import_node_path5.default.resolve(cwd, "src/app");
  if (!import_node_fs5.default.existsSync(libDir)) import_node_fs5.default.mkdirSync(libDir, { recursive: true });
  if (!import_node_fs5.default.existsSync(appDir)) import_node_fs5.default.mkdirSync(appDir, { recursive: true });
  const tokensPath = import_node_path5.default.join(libDir, "tokens.ts");
  if (!import_node_fs5.default.existsSync(tokensPath)) {
    import_node_fs5.default.writeFileSync(tokensPath, tokensTemplate, "utf-8");
  }
  const cssPath = import_node_path5.default.join(appDir, "globals.css");
  if (!import_node_fs5.default.existsSync(cssPath)) {
    import_node_fs5.default.writeFileSync(cssPath, cssTemplate, "utf-8");
  }
  return { tokensPath, cssPath };
}
function scaffoldComponent(componentName, cwd = process.cwd()) {
  const key = componentName.toLowerCase();
  const template = COMPONENT_TEMPLATES[key];
  if (!template) {
    return null;
  }
  const uiDir = import_node_path5.default.resolve(cwd, "src/components/ui");
  if (!import_node_fs5.default.existsSync(uiDir)) {
    import_node_fs5.default.mkdirSync(uiDir, { recursive: true });
  }
  const targetPath = import_node_path5.default.join(uiDir, template.filename);
  if (!import_node_fs5.default.existsSync(targetPath)) {
    import_node_fs5.default.writeFileSync(targetPath, template.content, "utf-8");
  }
  return targetPath;
}
function scaffoldAllPrimitives(cwd = process.cwd()) {
  const created = [];
  const { tokensPath, cssPath } = scaffoldTokens(cwd);
  created.push(tokensPath, cssPath);
  for (const name of Object.keys(COMPONENT_TEMPLATES)) {
    const filePath = scaffoldComponent(name, cwd);
    if (filePath && !created.includes(filePath)) {
      created.push(filePath);
    }
  }
  return created;
}

// src/export-rules/index.ts
function generateMarkdownRules(config) {
  const minFont = config.tokens?.typography?.minFontSize || "14px";
  const maxFont = config.tokens?.typography?.maxFontSize || "32px";
  const maxWeight = config.tokens?.typography?.maxFontWeight ?? 500;
  const maxControlHeight = config.tokens?.geometry?.maxControlHeight || "36px";
  return `<!-- BEGIN:design-system-enforcer-rules -->
# Design System Rules & Constraints (Enforced by DSE)

## Typography & Font Sizing Rules
- **Primary Body Font**: Always use standard ${minFont} (\`text-sm\`) as the primary body font across all tables, lists, cards, form inputs, dialogs, and buttons.
- **Large Body Font**: Use 16px (\`text-base\`) for large body text and emphasized copy.
- **Maximum Heading Size**: Headings must never exceed ${maxFont} (\`text-2xl\`). Headings larger than ${maxFont} (\`text-3xl\`, \`text-4xl\`) are strictly prohibited.
- **Prohibition on Font Sizes Below ${minFont}**: Font sizes smaller than ${minFont} (e.g. \`text-xs\`, \`12px\`, \`10px\`) are strictly prohibited.
- **Font Weight Cap**: Standard text and interactive elements must not exceed Medium / ${maxWeight} (\`font-medium\`). \`font-semibold\` or \`font-bold\` are prohibited.
- **No Uppercase Text**: Disallow \`uppercase\` or \`capitalize\` CSS transforms. Use standard sentence or title case.

## UI Iconography & Symbols
- **No Raw Text Arrows**: Never use raw unicode or ASCII arrows (\u2192, \u2190, \u2191, \u2193, =>, ->). Use design system icon components instead.
- **No Emojis in UI**: Do NOT use raw emojis in badges, chips, buttons, labels, or table headers.

## Component Design & Primitives
- **Button Component**: Always use \`<Button>\` from \`@/components/ui/button\`. Raw \`<button>\` HTML elements are strictly prohibited.
  - Height is strictly standard ${maxControlHeight} (\`h-[36px] min-h-[36px]\`) with 8px corner radius (\`rounded-md\`).
  - Font weight is strictly \`font-medium\`.
  - **No Chip-Colored Buttons**: Buttons must NEVER use semantic chip colors (\`bg-emerald-*\`, \`bg-red-*\`, \`variant="danger"\`, \`variant="success"\`).
- **Chip Component**: \`<Chip>\` from \`@/components/ui/chip\` is the single source of truth for all tags, statuses, pills, and badges. Height is strictly standard ${maxControlHeight} with 8px radius.
  - **No Pseudo-Chips**: Never use raw \`<span>\` or \`<div>\` elements styled with fills and rounded corners to imitate chips.
- **Input Component**: Always use \`<Input>\` from \`@/components/ui/input\`. Raw \`<input type="text">\` is strictly prohibited.
- **Dropdown Component**: Always use \`<Dropdown>\` from \`@/components/ui/dropdown\` instead of raw \`<select>\`.
- **Checkbox Component**: Strictly 20px dimension (\`size-5\`) and 4px corner radius (\`rounded-xs\`). 4px radius is strictly reserved for checkboxes only.
- **Cards & Containers**: Main content cards must strictly use 12px corner radius (\`rounded-lg\`).

## Table Component Rules
- **Mandatory Table Suite**: Always use \`<Table>\`, \`<TableHeader>\`, \`<TableHead>\`, \`<TableBody>\`, \`<TableRow>\`, and \`<TableCell>\` from \`@/components/ui/table\`. Raw HTML table elements (\`<table>\`, \`<tr>\`, \`<td>\`) are strictly prohibited.
- **Mandatory TableHead Icons**: Every column header (\`<TableHead>\`) must provide an icon component via the \`icon\` prop (\`icon={<MailIcon size={20} />}\`). Only dedicated row selection checkbox columns are exempt.
- **Mandatory Resizable Columns**: All data columns must support column resizing. Explicitly setting \`resizable={false}\` on data columns is strictly prohibited.
- **Single Borders**: Never wrap \`<Table>\` in redundant outer bordered containers. Never apply \`divide-y\` to \`<TableBody>\`.
- **Uniform Table Typography**: All fonts across all cells and headers must share standard 14px size and uniform color (\`text-text-primary\`).
- **No Vertical Stacking**: Never vertically stack subtext or metadata inside \`<TableCell>\`. Every piece of metadata must reside in its own dedicated, resizable column.
- **Windowed Pagination**: Data tables rendering dynamic collections must implement pagination (Previous/Next buttons, page size selector [25, 50, 100], and 'Showing X to Y of Z' range indicator).

## Modals & Overlays
- **No Backdrop Blur**: \`backdrop-blur-*\` is strictly prohibited. Modal backdrops must use standard neutral grey overlay (\`bg-neutral-100/80\`) without blur.
<!-- END:design-system-enforcer-rules -->
`;
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

// src/doctor/formatter.ts
var import_picocolors2 = __toESM(require("picocolors"), 1);
function renderProgressBar(percentage, width = 20) {
  const filledChars = Math.round(percentage / 100 * width);
  const emptyChars = width - filledChars;
  let colorFn = import_picocolors2.default.green;
  if (percentage < 70) colorFn = import_picocolors2.default.red;
  else if (percentage < 90) colorFn = import_picocolors2.default.yellow;
  const bar = colorFn("\u2588".repeat(filledChars)) + import_picocolors2.default.dim("\u2591".repeat(emptyChars));
  return `${bar} ${colorFn(percentage.toString().padStart(3) + "%")}`;
}
function formatDoctorOutput(report) {
  const lines = [];
  lines.push("");
  lines.push(import_picocolors2.default.bold(import_picocolors2.default.cyan("========================================================")));
  lines.push(import_picocolors2.default.bold(import_picocolors2.default.cyan("       DESIGN SYSTEM ENFORCER - HEALTH REPORT           ")));
  lines.push(import_picocolors2.default.bold(import_picocolors2.default.cyan("========================================================")));
  lines.push("");
  let gradeColor = import_picocolors2.default.green;
  if (report.grade === "B") gradeColor = import_picocolors2.default.cyan;
  else if (report.grade === "C") gradeColor = import_picocolors2.default.yellow;
  else if (report.grade === "D" || report.grade === "F") gradeColor = import_picocolors2.default.red;
  lines.push(
    `  ${import_picocolors2.default.bold("Overall Score:")}  ${gradeColor(import_picocolors2.default.bold(report.overallScore + "/100"))}  [${gradeColor(import_picocolors2.default.bold(report.grade))}]`
  );
  lines.push(`  ${import_picocolors2.default.bold("Scanned Files:")}  ${import_picocolors2.default.white(report.scannedFiles)}`);
  lines.push(`  ${import_picocolors2.default.bold("Total Issues:")}   ${report.totalViolations === 0 ? import_picocolors2.default.green("0") : import_picocolors2.default.red(report.totalViolations)}`);
  lines.push("");
  lines.push(import_picocolors2.default.bold("  Category Compliance:"));
  report.categories.forEach((cat) => {
    const paddedName = cat.name.padEnd(22, " ");
    const issueCount = cat.violations > 0 ? import_picocolors2.default.dim(`(${cat.violations} issues)`) : "";
    lines.push(`    ${import_picocolors2.default.dim(paddedName)} ${renderProgressBar(cat.score)} ${issueCount}`);
  });
  lines.push("");
  if (report.fileBreakdown.length > 0) {
    lines.push(import_picocolors2.default.bold(import_picocolors2.default.yellow("  Top Offending Files:")));
    report.fileBreakdown.forEach((item, idx) => {
      lines.push(`    ${idx + 1}. ${import_picocolors2.default.cyan(item.file)}: ${import_picocolors2.default.red(item.violations + " violations")}`);
    });
    lines.push("");
    lines.push(import_picocolors2.default.dim("  Run 'dse check' for detailed line-by-line violation reports."));
    lines.push(import_picocolors2.default.dim("  Run 'dse fix' to automatically remediate common violations."));
  } else {
    lines.push(import_picocolors2.default.bold(import_picocolors2.default.green("  \u2714 All design tokens and component invariants are 100% compliant!")));
  }
  lines.push("");
  return lines.join("\n");
}

// src/fixer/index.ts
var import_node_fs6 = __toESM(require("fs"), 1);
var import_node_path6 = __toESM(require("path"), 1);
async function runDseFix(config, cwd = process.cwd()) {
  const scanResult = await runDseScan(config, cwd);
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
    const fullPath = import_node_path6.default.resolve(cwd, relPath);
    if (!import_node_fs6.default.existsSync(fullPath)) continue;
    let content = import_node_fs6.default.readFileSync(fullPath, "utf-8");
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
      import_node_fs6.default.writeFileSync(fullPath, content, "utf-8");
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
var import_node_fs7 = __toESM(require("fs"), 1);
var import_node_path7 = __toESM(require("path"), 1);
function generateAgentInstructions(config) {
  const allowedRadii = config.tokens?.geometry?.allowedRadii?.join(", ") || "0px, 8px, 12px, 16px, 9999px";
  const maxControlHeight = config.tokens?.geometry?.maxControlHeight || 36;
  const bannedColors = config.tokens?.colors?.bannedColorFamilies?.join(", ") || "slate, gray, zinc, stone, etc.";
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
  const gitDir = import_node_path7.default.resolve(cwd, ".git");
  if (!import_node_fs7.default.existsSync(gitDir)) {
    throw new Error("No .git repository found in this directory.");
  }
  const hooksDir = import_node_path7.default.resolve(gitDir, "hooks");
  if (!import_node_fs7.default.existsSync(hooksDir)) {
    import_node_fs7.default.mkdirSync(hooksDir, { recursive: true });
  }
  const hookPath = import_node_path7.default.resolve(hooksDir, "pre-commit");
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
  import_node_fs7.default.writeFileSync(hookPath, hookScript, { mode: 493 });
  return true;
}

// src/cli.ts
var program = new import_commander.Command();
program.name("dse").description("Design System Enforcer (DSE) - AST-based Linter and Scaffold Engine").version("1.0.4");
program.command("check [targetDir]", { isDefault: true }).description("Scan codebase and enforce Design System rules").option("-c, --config <path>", "Path to custom dse.config.js / dse.config.json").option("-f, --format <format>", "Output format: 'stylish' | 'json'", "stylish").option("--strict", "Treat warnings as errors", false).action(async (targetDirArg, options) => {
  try {
    const cwd = targetDirArg ? import_node_path8.default.resolve(process.cwd(), targetDirArg) : process.cwd();
    const config = await loadConfig(cwd, options.config);
    const result = await runDseScan(config, cwd);
    if (options.format === "json") {
      console.log(formatJson(result));
    } else {
      console.log(formatStylish(result));
    }
    const totalErrors = options.strict ? result.errorCount + result.warningCount : result.errorCount;
    if (totalErrors > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error(import_picocolors3.default.red(`
\u2716 Error running scan: ${err.message}`));
    process.exit(1);
  }
});
program.command("doctor [targetDir]").description("Perform a visual Design System health audit and compute compliance score").option("-c, --config <path>", "Path to custom dse.config.js / dse.config.json").action(async (targetDirArg, options) => {
  try {
    const cwd = targetDirArg ? import_node_path8.default.resolve(process.cwd(), targetDirArg) : process.cwd();
    const config = await loadConfig(cwd, options.config);
    const result = await runDseScan(config, cwd);
    const report = computeDoctorScore(result);
    console.log(formatDoctorOutput(report));
  } catch (err) {
    console.error(import_picocolors3.default.red(`
\u2716 Error generating health report: ${err.message}`));
    process.exit(1);
  }
});
program.command("fix [targetDir]").description("Automatically remediate common Design System violations in place").option("-c, --config <path>", "Path to custom dse.config.js / dse.config.json").action(async (targetDirArg, options) => {
  try {
    const cwd = targetDirArg ? import_node_path8.default.resolve(process.cwd(), targetDirArg) : process.cwd();
    const config = await loadConfig(cwd, options.config);
    console.log(import_picocolors3.default.cyan("\n\u{1F527} Running Design System Enforcer Auto-Fixer...\n"));
    const fixReport = await runDseFix(config, cwd);
    if (fixReport.filesFixed === 0) {
      console.log(import_picocolors3.default.green("\u2714 No auto-fixable violations found. Your codebase is clean!"));
    } else {
      console.log(import_picocolors3.default.bold(import_picocolors3.default.green(`\u2714 Successfully fixed ${fixReport.totalModifications} issues across ${fixReport.filesFixed} files:
`)));
      fixReport.details.forEach((item) => {
        console.log(`  ${import_picocolors3.default.bold(import_picocolors3.default.cyan(item.file))}:`);
        item.fixes.forEach((f) => console.log(`    - ${import_picocolors3.default.dim(f)}`));
      });
    }
    console.log("");
  } catch (err) {
    console.error(import_picocolors3.default.red(`
\u2716 Error during auto-fix: ${err.message}`));
    process.exit(1);
  }
});
program.command("detect [targetDir]").description("Inspect project architecture, framework, libraries, and design tokens autonomously").action((targetDirArg) => {
  const cwd = targetDirArg ? import_node_path8.default.resolve(process.cwd(), targetDirArg) : process.cwd();
  const info = detectProject(cwd);
  console.log(import_picocolors3.default.bold(import_picocolors3.default.cyan("\n\u{1F50D} DSE Autonomous Project Diagnostics\n")));
  console.log(`  ${import_picocolors3.default.bold("Target Directory:")}   ${info.root}`);
  console.log(`  ${import_picocolors3.default.bold("Framework:")}          ${import_picocolors3.default.green(info.framework)}`);
  console.log(`  ${import_picocolors3.default.bold("Monorepo:")}           ${info.isMonorepo ? import_picocolors3.default.yellow("Yes") : "No"}`);
  if (info.isMonorepo && info.monorepoWorkspaces.length > 0) {
    console.log(`  ${import_picocolors3.default.bold("Workspaces:")}         ${info.monorepoWorkspaces.join(", ")}`);
  }
  console.log(`  ${import_picocolors3.default.bold("Libraries:")}          ${info.libraries.length ? import_picocolors3.default.magenta(info.libraries.join(", ")) : "None"}`);
  console.log(`  ${import_picocolors3.default.bold("Tailwind CSS:")}       ${info.hasTailwind ? import_picocolors3.default.green(info.tailwindVersion || "Yes") : "No"}`);
  console.log(`  ${import_picocolors3.default.bold("TypeScript:")}         ${info.hasTypeScript ? "Yes" : "No"}`);
  console.log(`  ${import_picocolors3.default.bold("Tokens File:")}        ${info.tokensFile ? import_picocolors3.default.cyan(info.tokensFile) : import_picocolors3.default.dim("None (using preset defaults)")}`);
  console.log(`  ${import_picocolors3.default.bold("Default Preset:")}     ${import_picocolors3.default.yellow(info.preset)}`);
  console.log(`  ${import_picocolors3.default.bold("Auto Includes:")}      ${info.suggestedIncludes.join(", ")}`);
  console.log(`  ${import_picocolors3.default.bold("Auto Ignores:")}       ${info.suggestedIgnores.slice(0, 5).join(", ")} (+${Math.max(0, info.suggestedIgnores.length - 5)} more)`);
  console.log("");
});
program.command("export-agent").description("Export ultra-compact prompt rules for Cursor, Claude, Antigravity, or Copilot").option("-w, --write <file>", "Target file to write/append into (e.g. .cursorrules, AGENTS.md)").action(async (options) => {
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const instructions = generateAgentInstructions(config);
  if (options.write) {
    const targetPath = import_node_path8.default.resolve(cwd, options.write);
    if (import_node_fs8.default.existsSync(targetPath)) {
      let existing = import_node_fs8.default.readFileSync(targetPath, "utf-8");
      const startTag = "<!-- BEGIN:DSE-AGENT-RULES -->";
      const endTag = "<!-- END:DSE-AGENT-RULES -->";
      if (existing.includes(startTag) && existing.includes(endTag)) {
        const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, "g");
        existing = existing.replace(regex, instructions.trim());
      } else {
        existing = `${existing.trim()}

${instructions.trim()}
`;
      }
      import_node_fs8.default.writeFileSync(targetPath, existing, "utf-8");
      console.log(import_picocolors3.default.green(`\u2714 Updated AI guardrails in ${options.write}`));
    } else {
      import_node_fs8.default.writeFileSync(targetPath, instructions, "utf-8");
      console.log(import_picocolors3.default.green(`\u2714 Created ${options.write} with AI guardrails`));
    }
  } else {
    console.log(instructions);
  }
});
program.command("hook [action]").description("Install or manage git pre-commit hooks to block non-compliant commits").action((action) => {
  if (action === "install" || !action) {
    try {
      installPreCommitHook(process.cwd());
      console.log(import_picocolors3.default.bold(import_picocolors3.default.green("\n\u2714 Successfully installed pre-commit hook in .git/hooks/pre-commit!")));
      console.log(import_picocolors3.default.dim("  Every git commit will now be checked with 'dse check --strict'.\n"));
    } catch (err) {
      console.error(import_picocolors3.default.red(`
\u2716 Could not install hook: ${err.message}
`));
    }
  }
});
program.command("init").description("Initialize DSE configuration in current repository").option("-p, --preset <name>", "Preset: berserk | recommended | minimal | python", "berserk").action((options) => {
  scaffoldConfig(process.cwd(), options.preset);
});
program.command("scaffold-tokens").description("Generate official design system tokens TypeScript/CSS file").action(() => {
  scaffoldTokens(process.cwd());
});
program.command("scaffold-primitives").description("Scaffold all canonical zero-compromise design system UI primitives").action(() => {
  scaffoldAllPrimitives(process.cwd());
});
program.command("export-rules").description("Export rules in Markdown format for AI coding assistants (AGENTS.md, .cursorrules, CLAUDE.md)").option("-w, --write <file>", "Write directly to target file (e.g. AGENTS.md)").action(async (options) => {
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const rulesMd = generateMarkdownRules(config);
  if (options.write) {
    const targetFile = import_node_path8.default.resolve(cwd, options.write);
    if (import_node_fs8.default.existsSync(targetFile)) {
      let existing = import_node_fs8.default.readFileSync(targetFile, "utf-8");
      const startTag = "<!-- BEGIN:design-system-enforcer-rules -->";
      const endTag = "<!-- END:design-system-enforcer-rules -->";
      if (existing.includes(startTag) && existing.includes(endTag)) {
        const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, "g");
        existing = existing.replace(regex, rulesMd.trim());
      } else {
        existing = `${existing.trim()}

${rulesMd.trim()}
`;
      }
      import_node_fs8.default.writeFileSync(targetFile, existing, "utf-8");
      console.log(import_picocolors3.default.green(`\u2714 Updated rules in ${options.write}`));
    } else {
      import_node_fs8.default.writeFileSync(targetFile, rulesMd, "utf-8");
      console.log(import_picocolors3.default.green(`\u2714 Created ${options.write} with design system rules`));
    }
  } else {
    console.log(rulesMd);
  }
});
program.parse(process.argv);
//# sourceMappingURL=cli.cjs.map