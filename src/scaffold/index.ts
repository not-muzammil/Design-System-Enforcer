import fs from "node:fs";
import path from "node:path";
import pc from "picocolors";
import { tokensTemplate } from "./templates/tokens.js";
import { cssTemplate } from "./templates/css.js";
import {
  buttonTemplate,
  chipTemplate,
  inputTemplate,
  dropdownTemplate,
  tableTemplate,
  tabsTemplate,
  cardTemplate,
  checkboxTemplate,
  skeletonTemplate,
  kbdTemplate,
} from "./templates/components.js";

export const COMPONENT_TEMPLATES: Record<string, { filename: string; content: string }> = {
  button: { filename: "button.tsx", content: buttonTemplate },
  chip: { filename: "chip.tsx", content: chipTemplate },
  badge: { filename: "badge.tsx", content: chipTemplate },
  input: { filename: "input.tsx", content: inputTemplate },
  dropdown: { filename: "dropdown.tsx", content: dropdownTemplate },
  table: { filename: "table.tsx", content: tableTemplate },
  tabs: { filename: "tabs.tsx", content: tabsTemplate },
  card: { filename: "card.tsx", content: cardTemplate },
  checkbox: { filename: "checkbox.tsx", content: checkboxTemplate },
  skeleton: { filename: "skeleton.tsx", content: skeletonTemplate },
  kbd: { filename: "kbd.tsx", content: kbdTemplate },
};

export function scaffoldConfig(cwd = process.cwd(), preset = "berserk"): string {
  if (preset === "python") {
    const jsonPath = path.resolve(cwd, "dse.config.json");
    if (fs.existsSync(jsonPath)) return jsonPath;

    const content = JSON.stringify(
      {
        preset: "python",
        targetDir: ".",
        include: ["**/*.{py,html,jinja,jinja2,css}"],
        exclude: [
          "**/.venv/**",
          "**/venv/**",
          "**/__pycache__/**",
          "**/.pytest_cache/**",
          "**/.git/**",
        ],
      },
      null,
      2
    ) + "\n";
    fs.writeFileSync(jsonPath, content, "utf-8");
    return jsonPath;
  }

  const configPath = path.resolve(cwd, "dse.config.js");
  if (fs.existsSync(configPath)) {
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

  fs.writeFileSync(configPath, content, "utf-8");
  return configPath;
}

export function scaffoldTokens(cwd = process.cwd()): { tokensPath: string; cssPath: string } {
  const libDir = path.resolve(cwd, "src/lib");
  const appDir = path.resolve(cwd, "src/app");

  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });
  if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });

  const tokensPath = path.join(libDir, "tokens.ts");
  if (!fs.existsSync(tokensPath)) {
    fs.writeFileSync(tokensPath, tokensTemplate, "utf-8");
  }

  const cssPath = path.join(appDir, "globals.css");
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, cssTemplate, "utf-8");
  }

  return { tokensPath, cssPath };
}

export function scaffoldComponent(componentName: string, cwd = process.cwd()): string | null {
  const key = componentName.toLowerCase();
  const template = COMPONENT_TEMPLATES[key];
  if (!template) {
    return null;
  }

  const uiDir = path.resolve(cwd, "src/components/ui");
  if (!fs.existsSync(uiDir)) {
    fs.mkdirSync(uiDir, { recursive: true });
  }

  const targetPath = path.join(uiDir, template.filename);
  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, template.content, "utf-8");
  }
  return targetPath;
}

export function scaffoldAllPrimitives(cwd = process.cwd()): string[] {
  const created: string[] = [];
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



