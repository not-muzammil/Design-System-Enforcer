import pc from "picocolors";
import type { DoctorReport } from "./index.js";

function renderProgressBar(percentage: number, width = 20): string {
  const filledChars = Math.round((percentage / 100) * width);
  const emptyChars = width - filledChars;

  let colorFn = pc.green;
  if (percentage < 70) colorFn = pc.red;
  else if (percentage < 90) colorFn = pc.yellow;

  const bar = colorFn("█".repeat(filledChars)) + pc.dim("░".repeat(emptyChars));
  return `${bar} ${colorFn(percentage.toString().padStart(3) + "%")}`;
}

export function formatDoctorOutput(report: DoctorReport): string {
  const lines: string[] = [];

  lines.push("");
  lines.push(pc.bold(pc.cyan("========================================================")));
  lines.push(pc.bold(pc.cyan("       DESIGN SYSTEM ENFORCER - HEALTH REPORT           ")));
  lines.push(pc.bold(pc.cyan("========================================================")));
  lines.push("");

  let gradeColor = pc.green;
  if (report.grade === "B") gradeColor = pc.cyan;
  else if (report.grade === "C") gradeColor = pc.yellow;
  else if (report.grade === "D" || report.grade === "F") gradeColor = pc.red;

  lines.push(
    `  ${pc.bold("Overall Score:")}  ${gradeColor(pc.bold(report.overallScore + "/100"))}  [${gradeColor(pc.bold(report.grade))}]`
  );
  lines.push(`  ${pc.bold("Scanned Files:")}  ${pc.white(report.scannedFiles)}`);
  lines.push(`  ${pc.bold("Total Issues:")}   ${report.totalViolations === 0 ? pc.green("0") : pc.red(report.totalViolations)}`);
  lines.push("");

  lines.push(pc.bold("  Category Compliance:"));
  report.categories.forEach((cat) => {
    const paddedName = cat.name.padEnd(22, " ");
    const issueCount = cat.violations > 0 ? pc.dim(`(${cat.violations} issues)`) : "";
    lines.push(`    ${pc.dim(paddedName)} ${renderProgressBar(cat.score)} ${issueCount}`);
  });
  lines.push("");

  if (report.fileBreakdown.length > 0) {
    lines.push(pc.bold(pc.yellow("  Top Offending Files:")));
    report.fileBreakdown.forEach((item, idx) => {
      lines.push(`    ${idx + 1}. ${pc.cyan(item.file)}: ${pc.red(item.violations + " violations")}`);
    });
    lines.push("");
    lines.push(pc.dim("  Run 'dse check' for detailed line-by-line violation reports."));
    lines.push(pc.dim("  Run 'dse fix' to automatically remediate common violations."));
  } else {
    lines.push(pc.bold(pc.green("  ✔ All design tokens and component invariants are 100% compliant!")));
  }

  lines.push("");
  return lines.join("\n");
}
