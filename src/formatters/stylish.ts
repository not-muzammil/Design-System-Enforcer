import pc from "picocolors";
import type { ScanResult } from "../config/types.js";

export function formatStylish(result: ScanResult): string {
  const output: string[] = [];

  output.push("");
  output.push(pc.bold(pc.cyan("========================================================")));
  output.push(pc.bold(pc.cyan("       DESIGN SYSTEM ENFORCER (DSE) - SCAN REPORT       ")));
  output.push(pc.bold(pc.cyan("========================================================")));
  output.push(`Scanned ${pc.bold(result.scannedFilesCount)} files.`);
  output.push("");

  // Component Inventory
  if (Object.keys(result.componentInventory).length > 0) {
    output.push(pc.bold(pc.dim("--- Design System Components Inventory ---")));
    for (const [name, info] of Object.entries(result.componentInventory)) {
      const paddedName = `<${name}`.padEnd(22) + ">";
      if (info.active) {
        output.push(`  • ${pc.white(paddedName)} : ${pc.green("✔ active")} (${info.fileCount} files)`);
      } else {
        output.push(`  • ${pc.white(paddedName)} : ${pc.red("✖ UNUSED / DEAD COMPONENT")}`);
      }
    }
    output.push("");
  }

  // Violations grouped by file
  if (result.violations.length > 0) {
    output.push(pc.bold(pc.red(`Found ${result.errorCount} error(s) and ${result.warningCount} warning(s):`)));
    output.push("");

    const grouped: Record<string, typeof result.violations> = {};
    for (const v of result.violations) {
      if (!grouped[v.file]) grouped[v.file] = [];
      grouped[v.file].push(v);
    }

    for (const [file, items] of Object.entries(grouped)) {
      output.push(pc.underline(pc.bold(file)));
      for (const item of items) {
        const badge = item.severity === "error" ? pc.red("error") : pc.yellow("warning");
        output.push(
          `  ${pc.dim(`${item.line}:${item.col}`)}  ${badge}  ${item.message}  ${pc.dim(`(${item.rule})`)}`
        );
        if (item.snippet) {
          output.push(`    ${pc.dim(">")} ${pc.italic(item.snippet)}`);
        }
      }
      output.push("");
    }

    output.push(
      pc.bold(
        pc.red(
          `✖ Failed with ${result.errorCount} error(s). Please resolve all Design System Enforcer violations before committing or deploying.`
        )
      )
    );
  } else {
    output.push(pc.bold(pc.green("✔ PERFECT! All files strictly comply with the Design System Enforcer rules.")));
  }

  output.push("");
  return output.join("\n");
}
