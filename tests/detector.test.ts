import { describe, it, expect } from "vitest";
import path from "node:path";
import { detectProject } from "../src/detector/index.js";
import { getSmartIgnores } from "../src/detector/ignores.js";

describe("Autonomous Detector", () => {
  it("detects current DSE repository correctly", () => {
    const cwd = process.cwd();
    const info = detectProject(cwd);

    expect(info.root).toBe(cwd);
    expect(info.hasTypeScript).toBe(true);
    expect(info.preset).toBe("berserk");
    expect(info.suggestedIncludes.length).toBeGreaterThan(0);
  });

  it("produces sensible smart ignores including gitignore and node_modules", () => {
    const ignores = getSmartIgnores(process.cwd());
    expect(ignores).toContain("**/node_modules/**");
    expect(ignores).toContain("**/.next/**");
    expect(ignores).toContain("**/dist/**");
  });
});

