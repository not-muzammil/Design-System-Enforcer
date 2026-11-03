import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import pc from "picocolors";
import { loadConfig } from "./config/loader.js";
import { runDseScan } from "./rules/runner.js";
import { formatStylish } from "./formatters/stylish.js";
import { formatJson } from "./formatters/json.js";
import {
  scaffoldConfig,
  scaffoldTokens,
  scaffoldComponent,
  scaffoldAllPrimitives,
  COMPONENT_TEMPLATES,
} from "./scaffold/index.js";
import { generateMarkdownRules } from "./export-rules/index.js";
import { detectProject } from "./detector/index.js";
import { computeDoctorScore } from "./doctor/index.js";
import { formatDoctorOutput } from "./doctor/formatter.js";
import { runDseFix } from "./fixer/index.js";
import { generateAgentInstructions, installPreCommitHook } from "./guardrails/index.js";

const program = new Command();

program
  .name("dse")
  .description("Design System Enforcer (DSE) - AST-based Linter and Scaffold Engine")
  .version("1.0.4");

// ---------------------------------------------------------------------------
// COMMAND: check (default)
// ---------------------------------------------------------------------------
program
  .command("check [targetDir]", { isDefault: true })
  .description("Scan codebase and enforce Design System rules")
  .option("-c, --config <path>", "Path to custom dse.config.js / dse.config.json")
  .option("-f, --format <format>", "Output format: 'stylish' | 'json'", "stylish")
  .option("--strict", "Treat warnings as errors", false)
  .action(async (targetDirArg, options) => {
    try {
      const cwd = targetDirArg ? path.resolve(process.cwd(), targetDirArg) : process.cwd();
      const config = await loadConfig(cwd, options.config);
      const result = await runDseScan(config, cwd);

      if (options.format === "json") {
        console.log(formatJson(result));
      } else {
        console.log(formatStylish(result));
      }

      const totalErrors = options.strict
        ? result.errorCount + result.warningCount
        : result.errorCount;

      if (totalErrors > 0) {
        process.exit(1);
      }
    } catch (err: any) {
      console.error(pc.red(`\n✖ Error running scan: ${err.message}`));
      process.exit(1);
    }
  });

// ---------------------------------------------------------------------------
// COMMAND: doctor (Visual Design Health Audit)
// ---------------------------------------------------------------------------
program
  .command("doctor [targetDir]")
  .description("Perform a visual Design System health audit and compute compliance score")
  .option("-c, --config <path>", "Path to custom dse.config.js / dse.config.json")
  .action(async (targetDirArg, options) => {
    try {
      const cwd = targetDirArg ? path.resolve(process.cwd(), targetDirArg) : process.cwd();
      const config = await loadConfig(cwd, options.config);
      const result = await runDseScan(config, cwd);
      const report = computeDoctorScore(result);
      console.log(formatDoctorOutput(report));
    } catch (err: any) {
      console.error(pc.red(`\n✖ Error generating health report: ${err.message}`));
      process.exit(1);
    }
  });

// ---------------------------------------------------------------------------
// COMMAND: fix (One-Click Auto-Remediation)
// ---------------------------------------------------------------------------
program
  .command("fix [targetDir]")
  .description("Automatically remediate common Design System violations in place")
  .option("-c, --config <path>", "Path to custom dse.config.js / dse.config.json")
  .action(async (targetDirArg, options) => {
    try {
      const cwd = targetDirArg ? path.resolve(process.cwd(), targetDirArg) : process.cwd();
      const config = await loadConfig(cwd, options.config);
      console.log(pc.cyan("\n🔧 Running Design System Enforcer Auto-Fixer...\n"));
      const fixReport = await runDseFix(config, cwd);

      if (fixReport.filesFixed === 0) {
        console.log(pc.green("✔ No auto-fixable violations found. Your codebase is clean!"));
      } else {
        console.log(pc.bold(pc.green(`✔ Successfully fixed ${fixReport.totalModifications} issues across ${fixReport.filesFixed} files:\n`)));
        fixReport.details.forEach((item) => {
          console.log(`  ${pc.bold(pc.cyan(item.file))}:`);
          item.fixes.forEach((f) => console.log(`    - ${pc.dim(f)}`));
        });
      }
      console.log("");
    } catch (err: any) {
      console.error(pc.red(`\n✖ Error during auto-fix: ${err.message}`));
      process.exit(1);
    }
  });

// ---------------------------------------------------------------------------
// COMMAND: detect (autonomous diagnostics)
// ---------------------------------------------------------------------------
program
  .command("detect [targetDir]")
  .description("Inspect project architecture, framework, libraries, and design tokens autonomously")
  .action((targetDirArg) => {
    const cwd = targetDirArg ? path.resolve(process.cwd(), targetDirArg) : process.cwd();
    const info = detectProject(cwd);

    console.log(pc.bold(pc.cyan("\n🔍 DSE Autonomous Project Diagnostics\n")));
    console.log(`  ${pc.bold("Target Directory:")}   ${info.root}`);
    console.log(`  ${pc.bold("Framework:")}          ${pc.green(info.framework)}`);
    console.log(`  ${pc.bold("Monorepo:")}           ${info.isMonorepo ? pc.yellow("Yes") : "No"}`);
    if (info.isMonorepo && info.monorepoWorkspaces.length > 0) {
      console.log(`  ${pc.bold("Workspaces:")}         ${info.monorepoWorkspaces.join(", ")}`);
    }
    console.log(`  ${pc.bold("Libraries:")}          ${info.libraries.length ? pc.magenta(info.libraries.join(", ")) : "None"}`);
    console.log(`  ${pc.bold("Tailwind CSS:")}       ${info.hasTailwind ? pc.green(info.tailwindVersion || "Yes") : "No"}`);
    console.log(`  ${pc.bold("TypeScript:")}         ${info.hasTypeScript ? "Yes" : "No"}`);
    console.log(`  ${pc.bold("Tokens File:")}        ${info.tokensFile ? pc.cyan(info.tokensFile) : pc.dim("None (using preset defaults)")}`);
    console.log(`  ${pc.bold("Default Preset:")}     ${pc.yellow(info.preset)}`);
    console.log(`  ${pc.bold("Auto Includes:")}      ${info.suggestedIncludes.join(", ")}`);
    console.log(`  ${pc.bold("Auto Ignores:")}       ${info.suggestedIgnores.slice(0, 5).join(", ")} (+${Math.max(0, info.suggestedIgnores.length - 5)} more)`);
    console.log("");
  });

// ---------------------------------------------------------------------------
// COMMAND: export-agent (AI Coding Assistant Guardrails)
// ---------------------------------------------------------------------------
program
  .command("export-agent")
  .description("Export ultra-compact prompt rules for Cursor, Claude, Antigravity, or Copilot")
  .option("-w, --write <file>", "Target file to write/append into (e.g. .cursorrules, AGENTS.md)")
  .action(async (options) => {
    const cwd = process.cwd();
    const config = await loadConfig(cwd);
    const instructions = generateAgentInstructions(config);

    if (options.write) {
      const targetPath = path.resolve(cwd, options.write);
      if (fs.existsSync(targetPath)) {
        let existing = fs.readFileSync(targetPath, "utf-8");
        const startTag = "<!-- BEGIN:DSE-AGENT-RULES -->";
        const endTag = "<!-- END:DSE-AGENT-RULES -->";

        if (existing.includes(startTag) && existing.includes(endTag)) {
          const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, "g");
          existing = existing.replace(regex, instructions.trim());
        } else {
          existing = `${existing.trim()}\n\n${instructions.trim()}\n`;
        }
        fs.writeFileSync(targetPath, existing, "utf-8");
        console.log(pc.green(`✔ Updated AI guardrails in ${options.write}`));
      } else {
        fs.writeFileSync(targetPath, instructions, "utf-8");
        console.log(pc.green(`✔ Created ${options.write} with AI guardrails`));
      }
    } else {
      console.log(instructions);
    }
  });

// ---------------------------------------------------------------------------
// COMMAND: hook (Git Pre-Commit Enforcer)
// ---------------------------------------------------------------------------
program
  .command("hook [action]")
  .description("Install or manage git pre-commit hooks to block non-compliant commits")
  .action((action) => {
    if (action === "install" || !action) {
      try {
        installPreCommitHook(process.cwd());
        console.log(pc.bold(pc.green("\n✔ Successfully installed pre-commit hook in .git/hooks/pre-commit!")));
        console.log(pc.dim("  Every git commit will now be checked with 'dse check --strict'.\n"));
      } catch (err: any) {
        console.error(pc.red(`\n✖ Could not install hook: ${err.message}\n`));
      }
    }
  });

// ---------------------------------------------------------------------------
// COMMAND: init
// ---------------------------------------------------------------------------
program
  .command("init")
  .description("Initialize DSE configuration in current repository")
  .option("-p, --preset <name>", "Preset: berserk | recommended | minimal | python", "berserk")
  .action((options) => {
    scaffoldConfig(process.cwd(), options.preset);
  });

// ---------------------------------------------------------------------------
// COMMAND: scaffold-tokens
// ---------------------------------------------------------------------------
program
  .command("scaffold-tokens")
  .description("Generate official design system tokens TypeScript/CSS file")
  .action(() => {
    scaffoldTokens(process.cwd());
  });

// ---------------------------------------------------------------------------
// COMMAND: scaffold-primitives
// ---------------------------------------------------------------------------
program
  .command("scaffold-primitives")
  .description("Scaffold all canonical zero-compromise design system UI primitives")
  .action(() => {
    scaffoldAllPrimitives(process.cwd());
  });

// ---------------------------------------------------------------------------
// COMMAND: export-rules
// ---------------------------------------------------------------------------
program
  .command("export-rules")
  .description("Export rules in Markdown format for AI coding assistants (AGENTS.md, .cursorrules, CLAUDE.md)")
  .option("-w, --write <file>", "Write directly to target file (e.g. AGENTS.md)")
  .action(async (options) => {
    const cwd = process.cwd();
    const config = await loadConfig(cwd);
    const rulesMd = generateMarkdownRules(config);

    if (options.write) {
      const targetFile = path.resolve(cwd, options.write);
      if (fs.existsSync(targetFile)) {
        let existing = fs.readFileSync(targetFile, "utf-8");
        const startTag = "<!-- BEGIN:design-system-enforcer-rules -->";
        const endTag = "<!-- END:design-system-enforcer-rules -->";

        if (existing.includes(startTag) && existing.includes(endTag)) {
          const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, "g");
          existing = existing.replace(regex, rulesMd.trim());
        } else {
          existing = `${existing.trim()}\n\n${rulesMd.trim()}\n`;
        }
        fs.writeFileSync(targetFile, existing, "utf-8");
        console.log(pc.green(`✔ Updated rules in ${options.write}`));
      } else {
        fs.writeFileSync(targetFile, rulesMd, "utf-8");
        console.log(pc.green(`✔ Created ${options.write} with design system rules`));
      }
    } else {
      console.log(rulesMd);
    }
  });

program.parse(process.argv);
