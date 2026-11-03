import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import type { DseConfig, ScanResult, Violation } from "../config/types.js";
import { parseTsx, getFileImports } from "../parser/ast.js";
import { runAstRules } from "./ast-rules.js";
import { runRegexRules } from "./regex-rules.js";
import { runPythonRules } from "./python-rules.js";
import type { AddViolationFn } from "./types.js";

export async function runDseScan(config: DseConfig, cwd = process.cwd()): Promise<ScanResult> {
  let targetDir = path.resolve(cwd, config.targetDir || "src");
  if (!fs.existsSync(targetDir)) {
    targetDir = cwd;
  }

  const includePatterns = config.include || ["**/*.{tsx,jsx,ts,js}"];
  const excludePatterns = config.exclude || [
    "**/node_modules/**",
    "**/.next/**",
    "**/public/**",
    "**/.git/**",
  ];

  // Component inventory setup
  const inventoryCounts: Record<string, number> = {};
  const inventoryDef = config.components?.requiredInventory || [];
  inventoryDef.forEach((comp) => {
    inventoryCounts[comp.name] = 0;
  });

  const rawFiles = await fg(includePatterns, {
    cwd: targetDir,
    absolute: true,
  });

  const files = rawFiles.filter((filePath) => {
    const relFromCwd = path.relative(cwd, filePath).replace(/\\/g, "/");
    for (const pattern of excludePatterns) {
      const clean = pattern.replace(/^\*\*?\//, "").replace(/\/\*\*?$/, "").replace(/\\/g, "/");
      if (clean && (relFromCwd === clean || relFromCwd.startsWith(clean + "/") || relFromCwd.includes("/" + clean + "/") || relFromCwd.endsWith("/" + clean))) {
        return false;
      }
    }
    return true;
  });

  const violations: Violation[] = [];
  const seenViolationKeys = new Set<string>();

  const addViolation: AddViolationFn = (file, line, col, rule, message, snippet) => {
    const normFile = path.relative(cwd, file).replace(/\\/g, "/");
    const key = `${normFile}:${line}:${rule}`;
    if (seenViolationKeys.has(key)) return;
    seenViolationKeys.add(key);

    const severity = config.rules?.[rule as keyof typeof config.rules] || "error";
    if (severity === "off") return;

    violations.push({
      file: normFile,
      line: line || 0,
      col: col || 0,
      rule,
      severity: severity === "warn" ? "warn" : "error",
      message,
      snippet: snippet ? snippet.trim() : undefined,
    });
  };

  let scannedJsxFiles = false;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const isJsx = filePath.endsWith(".tsx") || filePath.endsWith(".jsx") || filePath.endsWith(".ts") || filePath.endsWith(".js");
    const isPythonOrTemplate = filePath.endsWith(".py") || filePath.endsWith(".html") || filePath.endsWith(".jinja") || filePath.endsWith(".jinja2") || filePath.endsWith(".css");

    if (isJsx) {
      scannedJsxFiles = true;
      // Track component inventory
      inventoryDef.forEach((comp) => {
        const names = [comp.componentName || comp.name, ...(comp.altNames || [])];
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

  // Component inventory verification (only if JSX/TSX components are in scope)
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
          message: `Required design system component '<${comp.name}>' is defined in the design system but never utilized anywhere across the application!`,
        });
      }
    });
  }

  const errorCount = violations.filter((v) => v.severity === "error").length;
  const warningCount = violations.filter((v) => v.severity === "warn").length;

  const componentInventoryReport: Record<string, { active: boolean; fileCount: number }> = {};
  if (scannedJsxFiles && inventoryDef.length > 0) {
    inventoryDef.forEach((comp) => {
      const count = inventoryCounts[comp.name] || 0;
      componentInventoryReport[comp.name] = {
        active: count > 0,
        fileCount: count,
      };
    });
  }

  return {
    violations,
    scannedFilesCount: files.length,
    errorCount,
    warningCount,
    componentInventory: componentInventoryReport,
  };
}
