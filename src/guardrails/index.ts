import fs from "node:fs";
import path from "node:path";
import pc from "picocolors";
import type { DseConfig } from "../config/types.js";

/**
 * Generates AI-optimized instructions specifically tuned for LLMs and coding assistants.
 */
export function generateAgentInstructions(config: DseConfig): string {
  const allowedRadii = config.tokens?.geometry?.allowedRadii?.join(", ") || "0px, 8px, 12px, 16px, 9999px";
  const maxControlHeight = config.tokens?.geometry?.maxControlHeight || 36;
  const bannedColors = config.tokens?.colors?.bannedColorFamilies?.join(", ") || "slate, gray, zinc, stone, etc.";

  return `<!-- BEGIN:DSE-AGENT-RULES -->
# DESIGN SYSTEM ENFORCER (DSE) - MANDATORY RULES

You MUST adhere to these design system invariants for all UI generation:

1. COMPONENT INVARIANTS:
   - NEVER use raw HTML: <button>, <select>, <textarea>, <table>, <input type="checkbox">, <input type="radio">.
   - ALWAYS use standard primitives: <Button>, <Dropdown>, <Textarea>, <Table>, <Checkbox>, <Chip>.
   - Never create pseudo-chips using raw <div> or <span> with background fills and borders. Use <Chip>.

2. WRAP INTEGRITY (COMPACT ELEMENTS):
   - Interactive compact elements (<Button>, <Chip>, <Badge>, <TableHead>, tabs) MUST NOT wrap text.
   - ALWAYS include 'whitespace-nowrap shrink-0' on compact interactive components.

3. GEOMETRY & RADII:
   - Standard control height for buttons and inputs is strictly max ${maxControlHeight}px ('h-[36px]' or 'h-9').
   - Allowed corner radii tokens: ${allowedRadii}. Never use random arbitrary radii.

4. COLOR SCALE & PURITY:
   - Strictly neutral palette for base surfaces and borders ('neutral-100' through 'neutral-900').
   - Banned arbitrary color families: ${bannedColors}.
   - Never use arbitrary inline hex colors ('#1a2b3c') in utility classes. Use design system CSS variables ('var(--primary)').

5. BEFORE FINISHING UI EDITS:
   - Run 'npx dse check' to verify zero design system violations.
<!-- END:DSE-AGENT-RULES -->
`;
}

/**
 * Installs a git pre-commit hook in .git/hooks/pre-commit
 */
export function installPreCommitHook(cwd = process.cwd()): boolean {
  const gitDir = path.resolve(cwd, ".git");
  if (!fs.existsSync(gitDir)) {
    throw new Error("No .git repository found in this directory.");
  }

  const hooksDir = path.resolve(gitDir, "hooks");
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hookPath = path.resolve(hooksDir, "pre-commit");
  const hookScript = `#!/usr/bin/env sh
# Design System Enforcer (DSE) Pre-Commit Hook
echo "\n🔍 Running Design System Enforcer pre-commit check..."

if command -v npx >/dev/null 2>&1; then
  npx dse check --strict
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "\n❌ Commit rejected: Design System violations found."
    echo "💡 Run 'npx dse fix' or 'npx dse check' to review issues.\n"
    exit 1
  fi
fi
`;

  fs.writeFileSync(hookPath, hookScript, { mode: 0o755 });
  return true;
}
