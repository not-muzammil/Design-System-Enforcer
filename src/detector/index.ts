import fs from "node:fs";
import path from "node:path";
import type { ComponentLibrary, Framework, ProjectInfo } from "./types.js";
import { getSmartIgnores } from "./ignores.js";

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  workspaces?: string[] | { packages?: string[] };
}

function safeReadJson<T>(filePath: string): T | null {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as T;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Autonomously inspects a project root offline to detect framework, libraries,
 * UI file locations, design tokens, and appropriate presets.
 */
export function detectProject(cwd = process.cwd()): ProjectInfo {
  const pkg = safeReadJson<PackageJson>(path.resolve(cwd, "package.json"));
  const deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };

  // 1. Detect Python vs JS/TS
  const hasRequirements = fs.existsSync(path.resolve(cwd, "requirements.txt"));
  const hasPyproject = fs.existsSync(path.resolve(cwd, "pyproject.toml"));
  const hasPython = hasRequirements || hasPyproject || fs.existsSync(path.resolve(cwd, "setup.py"));

  // Check if streamlit
  let isStreamlit = false;
  if (hasPython) {
    if (hasRequirements) {
      try {
        const reqContent = fs.readFileSync(path.resolve(cwd, "requirements.txt"), "utf-8");
        if (reqContent.toLowerCase().includes("streamlit")) {
          isStreamlit = true;
        }
      } catch {}
    }
  }

  // 2. Detect Monorepo
  const isPnpmMonorepo = fs.existsSync(path.resolve(cwd, "pnpm-workspace.yaml"));
  const isTurbo = fs.existsSync(path.resolve(cwd, "turbo.json"));
  let monorepoWorkspaces: string[] = [];
  if (Array.isArray(pkg?.workspaces)) {
    monorepoWorkspaces = pkg.workspaces;
  } else if (pkg?.workspaces?.packages) {
    monorepoWorkspaces = pkg.workspaces.packages;
  }
  const isMonorepo = isPnpmMonorepo || isTurbo || monorepoWorkspaces.length > 0;

  // 3. Detect Framework
  let framework: Framework = "unknown";
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

  // 4. Detect Component Libraries & Icons
  const libraries: ComponentLibrary[] = [];
  const hasShadcnConfig = fs.existsSync(path.resolve(cwd, "components.json"));
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

  // 5. Detect Tailwind details
  const hasTailwind = Boolean(deps["tailwindcss"] || fs.existsSync(path.resolve(cwd, "tailwind.config.js")) || fs.existsSync(path.resolve(cwd, "tailwind.config.ts")));
  let tailwindVersion: "v3" | "v4" | undefined;
  if (hasTailwind) {
    const rawVersion = deps["tailwindcss"] || "";
    if (rawVersion.includes("^4") || rawVersion.includes("~4") || rawVersion.startsWith("4")) {
      tailwindVersion = "v4";
    } else {
      tailwindVersion = "v3";
    }
  }

  // 6. Detect TypeScript
  const hasTypeScript = Boolean(deps["typescript"] || fs.existsSync(path.resolve(cwd, "tsconfig.json")));

  // 7. Auto-detect UI directories & includes
  const suggestedIncludes: string[] = [];
  const extGroup = hasTypeScript ? "{tsx,jsx,ts,js}" : "{jsx,js}";

  // Subfolder checks (e.g. frontend/src or apps/web/src or simple src/)
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
    "components",
  ];

  let foundUiDir = false;
  for (const dir of candidateDirs) {
    if (fs.existsSync(path.resolve(cwd, dir))) {
      // Avoid adding broad 'frontend' if 'frontend/src' exists
      if (dir === "frontend" && fs.existsSync(path.resolve(cwd, "frontend/src"))) continue;
      if (dir === "client" && fs.existsSync(path.resolve(cwd, "client/src"))) continue;
      if (dir === "apps/web" && fs.existsSync(path.resolve(cwd, "apps/web/src"))) continue;

      suggestedIncludes.push(`${dir}/**/*.${extGroup}`);
      foundUiDir = true;
      break;
    }
  }

  // If no standard folder found and has python files
  if (hasPython) {
    suggestedIncludes.push("**/*.py");
  } else if (!foundUiDir) {
    suggestedIncludes.push(`**/*.${extGroup}`);
  }

  // 8. Auto-detect Ignores
  const suggestedIgnores = getSmartIgnores(cwd);
  // If shadcn is installed, auto-ignore the raw generated primitives components/ui
  if (hasShadcnConfig || libraries.includes("shadcn")) {
    suggestedIgnores.push("**/components/ui/**");
  }

  // 9. Auto-detect Token Files
  const tokenCandidates = [
    "frontend/src/lib/tokens.ts",
    "frontend/src/tokens.ts",
    "src/lib/tokens.ts",
    "src/tokens.ts",
    "src/design/tokens.ts",
    "styles/tokens.css",
    "src/app/globals.css",
    "frontend/src/index.css",
    "src/index.css",
  ];

  let tokensFile: string | undefined;
  for (const candidate of tokenCandidates) {
    if (fs.existsSync(path.resolve(cwd, candidate))) {
      tokensFile = candidate;
      break;
    }
  }

  // 10. Decide Preset
  let preset: "berserk" | "default" | "python" = "berserk";
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
    preset,
  };
}

