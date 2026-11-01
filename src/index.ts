export * from "./config/types.js";
export { defineConfig, loadConfig } from "./config/loader.js";
export { berserkPreset } from "./config/presets/berserk.js";
export { defaultPreset } from "./config/presets/default.js";
export { runDseScan } from "./rules/runner.js";
export { formatStylish } from "./formatters/stylish.js";
export { formatJson } from "./formatters/json.js";
export {
  scaffoldConfig,
  scaffoldTokens,
  scaffoldComponent,
  scaffoldAllPrimitives,
} from "./scaffold/index.js";
export { generateMarkdownRules } from "./export-rules/index.js";

import { loadConfig } from "./config/loader.js";
import { runDseScan } from "./rules/runner.js";
import type { DseConfig, ScanResult } from "./config/types.js";

/**
 * Programmatic scan API for running DSE inside tests, Vite plugins, or Next.js dev server overlays.
 */
export async function scanProject(options?: {
  config?: DseConfig;
  configPath?: string;
  cwd?: string;
}): Promise<ScanResult> {
  const cwd = options?.cwd || process.cwd();
  const config = options?.config || (await loadConfig(cwd, options?.configPath));
  return runDseScan(config, cwd);
}
