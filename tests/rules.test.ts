import { describe, it, expect } from "vitest";
import { parseTsx } from "../src/parser/ast.js";
import { runAstRules } from "../src/rules/ast-rules.js";
import { runRegexRules } from "../src/rules/regex-rules.js";
import { berserkPreset } from "../src/config/presets/berserk.js";

describe("DSE Rules Enforcement", () => {
  it("flags raw HTML <button> and enforces <Button>", () => {
    const code = `export const Component = () => <button>Click</button>;`;
    const sourceFile = parseTsx("test.tsx", code);
    const violations: any[] = [];

    runAstRules(
      sourceFile,
      "test.tsx",
      (file, line, col, rule, message, snippet) => {
        violations.push({ rule, message });
      },
      {},
      berserkPreset
    );

    expect(violations.some((v) => v.rule === "no-raw-html-elements")).toBe(true);
  });

  it("flags text arrows in JSX/text", () => {
    const code = `export const View = () => <span>Next Step -></span>;`;
    const violations: any[] = [];

    runRegexRules(
      code,
      "test.tsx",
      (file, line, col, rule, message, snippet) => {
        violations.push({ rule, message });
      },
      berserkPreset
    );

    expect(violations.some((v) => v.rule === "no-text-arrows")).toBe(true);
  });

  it("flags backdrop blur classes", () => {
    const code = `export const Modal = () => <div className="fixed inset-0 backdrop-blur-md" />;`;
    const violations: any[] = [];

    runRegexRules(
      code,
      "test.tsx",
      (file, line, col, rule, message, snippet) => {
        violations.push({ rule, message });
      },
      berserkPreset
    );

    expect(violations.some((v) => v.rule === "no-backdrop-blur")).toBe(true);
  });
});
