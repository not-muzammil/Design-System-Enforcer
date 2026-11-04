import { describe, it, expect } from "vitest";
import { assertValidStyles, DesignSystemRuntimeError } from "../src/runtime/core.js";

describe("DSE Multi-Stack Runtime Error Enforcer", () => {
  it("throws DesignSystemRuntimeError on hardcoded hex color in classes", () => {
    expect(() => {
      assertValidStyles("p-4 bg-[#ff0000] text-white", "Card", "react");
    }).toThrow(DesignSystemRuntimeError);
  });

  it("throws DesignSystemRuntimeError on hardcoded off-palette colors in application code", () => {
    expect(() => {
      assertValidStyles("p-4 bg-purple-600 text-white", "MyComponent", "next");
    }).toThrow(DesignSystemRuntimeError);
  });

  it("throws DesignSystemRuntimeError on inline style objects with hex colors", () => {
    expect(() => {
      assertValidStyles({ backgroundColor: "#257AFF" }, "Header", "astro");
    }).toThrow(DesignSystemRuntimeError);
  });

  it("throws DesignSystemRuntimeError on compact element text-wrapping", () => {
    expect(() => {
      assertValidStyles("whitespace-normal px-4", "Button", "react");
    }).toThrow(DesignSystemRuntimeError);
  });

  it("allows standard neutral tokens and CSS variables without throwing", () => {
    expect(() => {
      assertValidStyles("bg-neutral-900 text-neutral-100 border border-neutral-200 bg-[var(--primary)]", "Button", "react");
    }).not.toThrow();
  });
});

