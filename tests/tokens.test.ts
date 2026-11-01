import { describe, it, expect } from "vitest";
import {
  decomposeToken,
  evaluateTypographyToken,
  evaluateGeometryToken,
  evaluateColorToken,
} from "../src/tokens/index.js";

describe("Token Decompiler & Evaluator", () => {
  it("decomposes complex responsive tokens", () => {
    const result = decomposeToken("hover:focus:md:text-xs");
    expect(result).toEqual({
      raw: "hover:focus:md:text-xs",
      core: "text-xs",
      variants: ["hover", "focus", "md"],
    });
  });

  it("flags font sizes smaller than 14px", () => {
    const violations = evaluateTypographyToken("text-xs");
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].rule).toBe("font-size-min");
  });

  it("flags arbitrary font sizes smaller than 14px", () => {
    const violations = evaluateTypographyToken("text-[12px]");
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].rule).toBe("font-size-min");
  });

  it("flags font sizes exceeding 32px cap", () => {
    const violations = evaluateTypographyToken("text-4xl");
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].rule).toBe("font-size-max");
  });

  it("flags font weights exceeding Medium (500)", () => {
    const violations = evaluateTypographyToken("font-bold");
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].rule).toBe("font-weight-max");
  });

  it("permits 4px radius on checkboxes only", () => {
    const regularViolations = evaluateGeometryToken("rounded-xs", undefined, false);
    expect(regularViolations.length).toBeGreaterThan(0);

    const checkboxViolations = evaluateGeometryToken("rounded-xs", undefined, true);
    expect(checkboxViolations.length).toBe(0);
  });

  it("flags banned color families", () => {
    const violations = evaluateColorToken("text-indigo-600", {
      bannedColorFamilies: ["indigo", "purple"],
    });
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].rule).toBe("no-banned-colors");
  });
});

