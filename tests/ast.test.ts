import { describe, it, expect } from "vitest";
import { parseTsx, getJsxTagName, getJsxAttributes, extractClassNames } from "../src/parser/ast.js";

describe("AST Parser & Traversal", () => {
  it("correctly parses JSX and extracts tag names and attributes", () => {
    const code = `<Button className="h-[36px] bg-neutral-900" disabled>Click Me</Button>`;
    const sourceFile = parseTsx("test.tsx", code);
    expect(sourceFile).toBeDefined();

    let tag = "";
    let attrs: any = {};

    sourceFile.forEachChild((node) => {
      // Find JSX
      const foundTag = getJsxTagName(node, sourceFile);
      if (foundTag) {
        tag = foundTag;
        attrs = getJsxAttributes(node, sourceFile);
      }
    });

    // In a top level expression statement
    const statement: any = sourceFile.statements[0];
    const jsxNode = statement?.expression;
    if (jsxNode) {
      tag = getJsxTagName(jsxNode, sourceFile) || "";
      attrs = getJsxAttributes(jsxNode, sourceFile);
    }

    expect(tag).toBe("Button");
    expect(attrs.className).toBeDefined();

    const classes = extractClassNames(attrs.className.initializer, sourceFile);
    expect(classes.map((c) => c.text)).toContain("h-[36px] bg-neutral-900");
  });
});
