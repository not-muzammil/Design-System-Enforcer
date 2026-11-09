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

  it("flags height and geometry overrides on standard primitives (anti-bypass)", () => {
    const code = `
      export const View = () => (
        <div>
          <Chip className="h-5 min-h-5 px-1.5">Ctrl + K</Chip>
          <Button className="h-12">Click</Button>
          <Chip style={{ height: 20 }}>Hacked</Chip>
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

    const geoOverrideViolations = violations.filter((v) => v.rule === "no-primitive-geometry-overrides");
    const styleOverrideViolations = violations.filter((v) => v.rule === "no-primitive-style-overrides");

    expect(geoOverrideViolations.length).toBeGreaterThanOrEqual(2);
    expect(styleOverrideViolations.length).toBe(1);
  });

  it("flags icon sizes below 16px (e.g. size={14})", () => {
    const code = `
      import { Check } from "lucide-react";
      export const Card = () => (
        <button>
          <Check size={14} />
          <span>Mark as Learned</span>
        </button>
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
      { Check: "lucide-react" },
      berserkPreset
    );

    const iconViolations = violations.filter((v) => v.rule === "icon-size-min");
    expect(iconViolations.length).toBe(1);
    expect(iconViolations[0].message).toContain("below the minimum allowed size of 16px");
  });

  it("permits icon sizes >= 16px (e.g. size={16})", () => {
    const code = `
      import { Check } from "lucide-react";
      export const Card = () => (
        <button>
          <Check size={16} />
          <span>Mark as Learned</span>
        </button>
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
      { Check: "lucide-react" },
      berserkPreset
    );

    const iconViolations = violations.filter((v) => v.rule === "icon-size-min");
    expect(iconViolations.length).toBe(0);
  });
});
