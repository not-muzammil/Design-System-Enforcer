import fs from "node:fs";
import path from "node:path";

const DEFAULT_IGNORES = [
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
  "**/generated/**",
];

/**
 * Parses local .gitignore if present and merges with sensible UI linter ignores.
 */
export function getSmartIgnores(cwd: string): string[] {
  const result = new Set<string>(DEFAULT_IGNORES);

  const gitignorePath = path.resolve(cwd, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    try {
      const content = fs.readFileSync(gitignorePath, "utf-8");
      const lines = content.split(/\r?\n/);
      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith("#")) continue;

        // Strip leading slash if any
        if (line.startsWith("/")) {
          line = line.substring(1);
        }

        // Strip trailing slash if directory
        if (line.endsWith("/")) {
          line = line.slice(0, -1);
        }

        if (line) {
          result.add(`**/${line}/**`);
          result.add(`**/${line}`);
        }
      }
    } catch {
      // Ignore reading error, proceed with defaults
    }
  }

  return Array.from(result);
}

