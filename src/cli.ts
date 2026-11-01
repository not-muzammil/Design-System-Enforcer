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

const program = new Command();

program
  .name("dse")
  .description("Design System Enforcer (DSE) - AST-based Linter and Scaffold Engine")
  .version("1.0.0");

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
    } catch (err) {
      console.error(pc.red("Error running DSE scan:"), err);
      process.exit(1);
    }
  });

// ---------------------------------------------------------------------------
// COMMAND: init
// ---------------------------------------------------------------------------
program
  .command("init")
  .description("Initialize DSE configuration and optionally scaffold base primitives")
  .option("--preset <name>", "Preset to use: 'berserk' | 'recommended' | 'python'")
  .option("--with-primitives", "Scaffold full base primitives and tokens suite", false)
  .action((options) => {
    const cwd = process.cwd();
    console.log(pc.bold(pc.cyan("\nInitializing Design System Enforcer (DSE)...")));

    const isPythonProject =
      fs.existsSync(path.resolve(cwd, "requirements.txt")) ||
      fs.existsSync(path.resolve(cwd, "pyproject.toml")) ||
      fs.existsSync(path.resolve(cwd, ".streamlit"));

    const preset = options.preset || (isPythonProject ? "python" : "berserk");

    // 1. Create config
    const configPath = scaffoldConfig(cwd, preset);
    console.log(pc.green("✔ Created config:"), pc.bold(path.relative(cwd, configPath)), pc.dim(`(preset: ${preset})`));

    // 2. Add "dse": "dse" to package.json if present
    const pkgPath = path.resolve(cwd, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        pkg.scripts = pkg.scripts || {};
        if (!pkg.scripts.dse) {
          pkg.scripts.dse = "dse";
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
          console.log(pc.green("✔ Added script 'dse' to package.json"));
        }
      } catch (err) {
        console.warn(pc.yellow("⚠ Could not update package.json:"), err);
      }
    }

    // 3. Optionally scaffold primitives
    if (options.withPrimitives) {
      console.log(pc.cyan("Scaffolding primitives and theme tokens..."));
      const created = scaffoldAllPrimitives(cwd);
      created.forEach((file) => {
        console.log(pc.green("✔ Created:"), pc.dim(path.relative(cwd, file)));
      });
    } else {
      console.log(
        pc.dim("\nTip: Run 'npx dse scaffold' to generate rule-compliant base primitives and tokens anytime.")
      );
    }

    console.log(pc.bold(pc.green("\n✔ DSE setup complete! Run 'npm run dse' to verify your project.\n")));
  });

// ---------------------------------------------------------------------------
// COMMAND: add <components...>
// ---------------------------------------------------------------------------
program
  .command("add <components...>")
  .description("Scaffold specific rule-compliant design system primitives (button, chip, input, table, tabs, card, checkbox, dropdown, skeleton)")
  .action((components: string[]) => {
    const cwd = process.cwd();
    console.log(pc.bold(pc.cyan("\nScaffolding requested components...")));

    for (const comp of components) {
      const filePath = scaffoldComponent(comp, cwd);
      if (filePath) {
        console.log(pc.green("✔ Created:"), pc.bold(path.relative(cwd, filePath)));
      } else {
        console.log(
          pc.yellow(`⚠ Unknown component '${comp}'. Available: ${Object.keys(COMPONENT_TEMPLATES).join(", ")}`)
        );
      }
    }
    console.log("");
  });

// ---------------------------------------------------------------------------
// COMMAND: scaffold
// ---------------------------------------------------------------------------
program
  .command("scaffold")
  .description("Scaffold all base primitives and HSL tokens into src/components/ui/ and src/lib/")
  .action(() => {
    const cwd = process.cwd();
    console.log(pc.bold(pc.cyan("\nScaffolding full design system suite...")));
    const created = scaffoldAllPrimitives(cwd);
    created.forEach((file) => {
      console.log(pc.green("✔ Created:"), pc.bold(path.relative(cwd, file)));
    });
    console.log(pc.bold(pc.green("\n✔ All design system primitives scaffolded successfully!\n")));
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

