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

  it("flags text wrapping on compact elements like Button, Chip, and TableHead", () => {
    const code = `
      export const View = () => (
        <div>
          <Button className="whitespace-normal">Click me</Button>
          <Chip className="flex-wrap">Status</Chip>
          <TableHead className="whitespace-normal">Header</TableHead>
        </div>
      );
    `;
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

    const wrapViolations = violations.filter((v) => v.rule === "no-wrapping-compact-elements");
    expect(wrapViolations.length).toBe(3);
  });

  it("bans raw default browser form and control elements", () => {
    const code = `
      export const BadForm = () => (
        <form>
          <input type="radio" name="plan" />
          <input type="range" min="0" max="100" />
          <textarea placeholder="Write..." />
          <select><option>Option 1</option></select>
          <progress value="50" max="100" />
        </form>
      );
    `;
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

    const rawViolations = violations.filter((v) => v.rule === "no-raw-html-elements");
    expect(rawViolations.length).toBe(5);
  });
});



