import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import pc from "picocolors";
import type { DseConfig, Violation } from "../config/types.js";
import { runDseScan } from "../rules/runner.js";

export interface FixReport {
  filesFixed: number;
  totalModifications: number;
  details: Array<{
    file: string;
    fixes: string[];
  }>;
}

/**
 * Automatically remediates common Design System Enforcer violations
 */
export async function runDseFix(config: DseConfig, cwd = process.cwd()): Promise<FixReport> {
  const scanResult = await runDseScan(config, cwd);
  const violationsByFile: Record<string, Violation[]> = {};

  scanResult.violations.forEach((v) => {
    if (!violationsByFile[v.file]) {
      violationsByFile[v.file] = [];
    }
    violationsByFile[v.file].push(v);
  });

  const details: FixReport["details"] = [];
  let totalModifications = 0;

  for (const [relPath, violations] of Object.entries(violationsByFile)) {
    const fullPath = path.resolve(cwd, relPath);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, "utf-8");
    const originalContent = content;
    const fileFixes: string[] = [];

    // Fix 1: Add whitespace-nowrap & shrink-0 to Button and Chip if missing
    // Remove whitespace-normal or flex-wrap on compact elements
    if (violations.some((v) => v.rule === "no-wrapping-compact-elements")) {
      const before = content;
      content = content.replace(/(<(?:Button|IconButton|Chip|Badge)\b[^>]*className=["'`][^"'`]*?)\b(?:whitespace-normal|whitespace-pre-wrap|flex-wrap)\b([^"'`]*?["'`])/g, (match, prefix, suffix) => {
        return `${prefix}whitespace-nowrap shrink-0${suffix}`;
      });

      if (before !== content) {
        fileFixes.push("Replaced wrapping classes with 'whitespace-nowrap shrink-0' on compact controls");
      }
    }

    // Fix 2: Upgrade raw <button> to <Button>
    if (violations.some((v) => v.rule === "no-raw-html-elements" && v.message.includes("<button>"))) {
      const before = content;
      content = content.replace(/<button(\s|>)/g, "<Button$1");
      content = content.replace(/<\/button>/g, "</Button>");

      if (before !== content) {
        // Ensure import exists
        if (!content.includes('import { Button }') && !content.includes('import Button') && !relPath.includes("components/ui/button")) {
          content = `import { Button } from "@/components/ui/button";\n` + content;
        }
        fileFixes.push("Upgraded raw <button> to <Button>");
      }
    }

    // Fix 3: Upgrade raw <select> to <Dropdown>
    if (violations.some((v) => v.rule === "no-raw-html-elements" && v.message.includes("<select>"))) {
      const before = content;
      content = content.replace(/<select(\s|>)/g, "<Dropdown$1");
      content = content.replace(/<\/select>/g, "</Dropdown>");

      if (before !== content) {
        if (!content.includes('import { Dropdown }') && !content.includes('import Dropdown') && !relPath.includes("components/ui/dropdown")) {
          content = `import { Dropdown } from "@/components/ui/dropdown";\n` + content;
        }
        fileFixes.push("Upgraded raw <select> to <Dropdown>");
      }
    }

    // Fix 4: Upgrade raw <textarea> to <Textarea>
    if (violations.some((v) => v.rule === "no-raw-html-elements" && v.message.includes("<textarea>"))) {
      const before = content;
      content = content.replace(/<textarea(\s|>)/g, "<Textarea$1");
      content = content.replace(/<\/textarea>/g, "</Textarea>");

      if (before !== content) {
        if (!content.includes('import { Textarea }') && !content.includes('import Textarea') && !relPath.includes("components/ui/textarea")) {
          content = `import { Textarea } from "@/components/ui/textarea";\n` + content;
        }
        fileFixes.push("Upgraded raw <textarea> to <Textarea>");
      }
    }

    // Fix 5: Replace common arbitrary text sizes
    if (violations.some((v) => v.rule === "no-arbitrary-text-size")) {
      const before = content;
      content = content.replace(/\btext-\[(?:13|13\.5|14|14\.5|15|15\.5)px\]\b/g, "text-sm");
      content = content.replace(/\btext-\[(?:11|11\.5|12|12\.5)px\]\b/g, "text-xs");
      content = content.replace(/\btext-\[(?:16|17)px\]\b/g, "text-base");

      if (before !== content) {
        fileFixes.push("Standardized arbitrary font sizes to compliant token scales");
      }
    }

    // Fix 6: Remove backdrop blur
    if (violations.some((v) => v.rule === "no-backdrop-blur")) {
      const before = content;
      content = content.replace(/\bbackdrop-blur(?:-(?:none|sm|md|lg|xl|2xl|3xl))?\b/g, "");
      if (before !== content) {
        fileFixes.push("Removed non-compliant backdrop-blur classes");
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, "utf-8");
      totalModifications += fileFixes.length;
      details.push({
        file: relPath,
        fixes: fileFixes,
      });
    }
  }

  return {
    filesFixed: details.length,
    totalModifications,
    details,
  };
}
