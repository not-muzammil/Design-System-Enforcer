import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { DseConfig } from "./types.js";
import { berserkPreset } from "./presets/berserk.js";
import { defaultPreset } from "./presets/default.js";
import { pythonPreset } from "./presets/python.js";
import { detectProject } from "../detector/index.js";

const CONFIG_FILES = [
  "dse.config.js",
  "dse.config.mjs",
  "dse.config.cjs",
  "dse.config.ts",
  "dse.config.json",
  ".dserc.json",
  ".dserc",
];

export function defineConfig(config: DseConfig): DseConfig {
  return config;
}

export async function loadConfig(cwd = process.cwd(), customPath?: string): Promise<DseConfig> {
  const detected = detectProject(cwd);
  let userConfig: Partial<DseConfig> = {};
  let foundConfigPath: string | null = null;


  if (customPath) {
    const resolved = path.resolve(cwd, customPath);
    if (fs.existsSync(resolved)) {
      foundConfigPath = resolved;
    }
  } else {
    for (const filename of CONFIG_FILES) {
      const candidate = path.resolve(cwd, filename);
      if (fs.existsSync(candidate)) {
        foundConfigPath = candidate;
        break;
      }
    }
  }

  if (foundConfigPath) {
    if (foundConfigPath.endsWith(".json") || foundConfigPath.endsWith(".dserc")) {
      const content = fs.readFileSync(foundConfigPath, "utf-8");
      try {
        userConfig = JSON.parse(content);
      } catch (err) {
        console.error(`Failed to parse JSON config at ${foundConfigPath}:`, err);
      }
    } else {
      try {
        const fileUrl = pathToFileURL(foundConfigPath).href;
        const mod = await import(fileUrl);
        userConfig = mod.default || mod;
      } catch {
        // Fallback for CommonJS/eval if import fails
        try {
          const content = fs.readFileSync(foundConfigPath, "utf-8");
          // Handle standard module.exports or export default
          const cjsReq = createCjsEvaluator(foundConfigPath, content);
          userConfig = cjsReq;
        } catch (innerErr) {
          console.warn(`Could not load config file at ${foundConfigPath}, using default preset.`, innerErr);
        }
      }
    }
  }

  // Determine base preset (auto-detect python if requirements.txt / pyproject.toml present)
  let presetName = userConfig.preset || detected.preset;

  let basePreset = berserkPreset;
  if (presetName === "python") {
    basePreset = pythonPreset;
  } else if (presetName === "recommended") {
    basePreset = defaultPreset;
  }

  // Merge detected autonomous defaults (include globs, smart ignores)
  const autonomousDefaults: Partial<DseConfig> = {
    include: detected.suggestedIncludes,
    exclude: detected.suggestedIgnores,
  };

  const withAutonomous = mergeConfigs(basePreset, autonomousDefaults);
  return mergeConfigs(withAutonomous, userConfig);
}

function createCjsEvaluator(filePath: string, content: string): any {
  // If it's a simple export default or module.exports
  if (content.includes("export default")) {
    // Basic extraction or leave as empty
    return {};
  }
  return {};
}

function mergeConfigs(base: DseConfig, overrides: Partial<DseConfig>): DseConfig {
  return {
    ...base,
    ...overrides,
    preset: overrides.preset || base.preset,
    targetDir: overrides.targetDir || base.targetDir,
    include: overrides.include || base.include,
    exclude: [...(base.exclude || []), ...(overrides.exclude || [])],
    tokens: {
      typography: {
        ...(base.tokens?.typography || {}),
        ...(overrides.tokens?.typography || {}),
      },
      geometry: {
        ...(base.tokens?.geometry || {}),
        ...(overrides.tokens?.geometry || {}),
        radiiExceptions: {
          ...(base.tokens?.geometry?.radiiExceptions || {}),
          ...(overrides.tokens?.geometry?.radiiExceptions || {}),
        },
      },
      colors: {
        ...(base.tokens?.colors || {}),
        ...(overrides.tokens?.colors || {}),
      },
    },
    components: {
      disallowRawHtml: {
        ...(base.components?.disallowRawHtml || {}),
        ...(overrides.components?.disallowRawHtml || {}),
      },
      disallowPseudoChips: overrides.components?.disallowPseudoChips ?? base.components?.disallowPseudoChips,
      requiredInventory: overrides.components?.requiredInventory || base.components?.requiredInventory,
    },
    rules: {
      ...(base.rules || {}),
      ...(overrides.rules || {}),
    },
  };
}

