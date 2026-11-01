import ts from "typescript";
import type { DseConfig } from "../config/types.js";
import {
  getJsxTagName,
  getJsxAttributes,
  extractClassNames,
  getNodePosition,
  type ExtractedClass,
} from "../parser/ast.js";
import {
  splitClassString,
  decomposeToken,
  evaluateTypographyToken,
  evaluateGeometryToken,
  evaluateColorToken,
} from "../tokens/index.js";
import type { AddViolationFn } from "./types.js";

export function runAstRules(
  sourceFile: ts.SourceFile,
  filePath: string,
  addViolation: AddViolationFn,
  fileImports: Record<string, string>,
  config: DseConfig
): void {
  const isTsx = filePath.endsWith(".tsx") || filePath.endsWith(".jsx");
  if (!isTsx) return;

  const content = sourceFile.getFullText();
  const fileLines = content.split("\n");

  let hasTable = false;
  let hasTableHeader = false;
  let hasTableHead = false;
  let hasTableBody = false;
  let hasTableRow = false;
  let hasTableCell = false;

  let usesColumnHeader = false;
  let usesResizeDivider = false;
  let usesResizableHook = false;

  function visitNode(node: ts.Node, parent: ts.Node | null, ancestors: ts.Node[]) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tagName = getJsxTagName(node, sourceFile);
      if (!tagName) return;

      const attributes = getJsxAttributes(node, sourceFile);
      const pos = getNodePosition(sourceFile, node);
      const lineSnippet = fileLines[pos.line - 1] || "";

      if (lineSnippet.includes("dse-ignore") || (pos.line > 1 && fileLines[pos.line - 2]?.includes("dse-ignore"))) {
        return;
      }

      // Track table components
      if (tagName === "Table") hasTable = true;
      else if (tagName === "TableHeader") hasTableHeader = true;
      else if (tagName === "TableHead") hasTableHead = true;
      else if (tagName === "TableBody") hasTableBody = true;
      else if (tagName === "TableRow") hasTableRow = true;
      else if (tagName === "TableCell") hasTableCell = true;
      else if (tagName === "TableColumnHeader") usesColumnHeader = true;
      else if (tagName === "TableResizeDivider") usesResizeDivider = true;

      // 1. Raw HTML Elements Check
      if (config.rules?.["no-raw-html-elements"] !== "off") {
        checkRawHtmlElements(tagName, attributes, pos, filePath, addViolation, lineSnippet, config);
      }

      // 2. Button Invariants Check
      checkButtonInvariants(tagName, attributes, pos, filePath, addViolation, lineSnippet, config);

      // 3. TableHead Invariants
      if (tagName === "TableHead") {
        checkTableHeadInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config);
      }

      // 4. TableBody Invariants
      if (tagName === "TableBody" && config.rules?.["table-no-divide-y"] !== "off") {
        checkTableBodyInvariants(attributes, pos, filePath, addViolation, lineSnippet, sourceFile);
      }

      // 5. TableCell Invariants
      if (tagName === "TableCell") {
        checkTableCellInvariants(node, attributes, pos, filePath, addViolation, lineSnippet, sourceFile, config);
      }

      // 6. Tabs Invariants
      if (tagName === "Tabs" && config.rules?.["tabs-component-required"] !== "off") {
        checkTabsElement(attributes, pos, filePath, addViolation, lineSnippet, fileImports);
      }

      // 7. Pseudo-Chips
      if ((tagName === "span" || tagName === "div") && config.rules?.["no-pseudo-chips"] !== "off") {
        checkPseudoChips(tagName, attributes, pos, filePath, addViolation, lineSnippet, sourceFile);
      }

      // 8. Element classes (tokens)
      checkElementClasses(node, tagName, attributes, pos, filePath, addViolation, sourceFile, config);
    }

    if (ts.isCallExpression(node)) {
      const fnName = node.expression.getText(sourceFile);
      if (fnName === "useResizableColumns") {
        usesResizableHook = true;
      }
    }
  }

  function walk(node: ts.Node, parent: ts.Node | null, ancestors: ts.Node[]) {
    visitNode(node, parent, ancestors);
    ancestors.push(node);
    ts.forEachChild(node, (child) => walk(child, node, ancestors));
    ancestors.pop();
  }

  walk(sourceFile, null, []);

  // Global file-level table checks
  checkTableFileInvariants(
    filePath,
    content,
    addViolation,
    fileImports,
    hasTable,
    hasTableHeader,
    hasTableHead,
    hasTableBody,
    hasTableRow,
    hasTableCell,
    usesColumnHeader,
    usesResizeDivider,
    usesResizableHook,
    config
  );
}

function checkRawHtmlElements(
  tagName: string,
  attributes: Record<string, any>,
  pos: { line: number; col: number },
  filePath: string,
  addViolation: AddViolationFn,
  lineSnippet: string,
  config: DseConfig
) {
  // Only check lowercase raw HTML elements (e.g. <button>, <select>, <table>), NOT uppercase React components (<Button>, <Table>)
  if (tagName[0] !== tagName[0].toLowerCase()) {
    return;
  }

  const replacements = config.components?.disallowRawHtml || {};
  const configEntry = replacements[tagName.toLowerCase()];

  if (configEntry) {
    addViolation(
      filePath,
      pos.line,
      pos.col,
      "no-raw-html-elements",
      `Raw '<${tagName}>' element detected. Use standard design system '<${configEntry.replaceWith}>' component${configEntry.importFrom ? ` from '${configEntry.importFrom}'` : ""}.`,
      lineSnippet
    );
    return;
  }

  if (tagName === "input") {
    const typeAttr = attributes.type;
    const typeVal = typeAttr && typeAttr.initializer ? typeAttr.initializer.getText().replace(/['"]/g, "") : "text";

    if (typeVal === "checkbox") {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-raw-html-elements",
        `Raw browser default '<input type="checkbox">' detected. Use standard design system '<Checkbox>' or '<Toggle>'.`,
        lineSnippet
      );
    } else if (["text", "email", "search"].includes(typeVal)) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-raw-html-elements",
        `Raw '<input type="${typeVal}">' element detected. Use standard design system '<Input>' component.`,
        lineSnippet
      );
    }
  }
}

function checkButtonInvariants(
  tagName: string,
  attributes: Record<string, any>,
  pos: { line: number; col: number },
  filePath: string,
  addViolation: AddViolationFn,
  lineSnippet: string,
  config: DseConfig
) {
  const isButton = ["Button", "IconButton", "ButtonyIcon", "FloatingActionButton"].includes(tagName);
  if (!isButton) return;

  if (config.rules?.["no-chip-colored-buttons"] !== "off" && attributes.variant && attributes.variant.initializer) {
    const varVal = attributes.variant.initializer.getText().replace(/['"]/g, "");
    if (["danger", "success", "warning", "error"].includes(varVal)) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-chip-colored-buttons",
        `Button uses semantic chip variant '${varVal}'. Buttons must use neutral variants ('primary', 'outline', 'secondary', 'ghost'). Semantic colors are reserved for <Chip>.`,
        lineSnippet
      );
    }
  }
}

function checkTableHeadInvariants(
  node: ts.Node,
  attributes: Record<string, any>,
  pos: { line: number; col: number },
  filePath: string,
  addViolation: AddViolationFn,
  lineSnippet: string,
  sourceFile: ts.SourceFile,
  config: DseConfig
) {
  const hasIconProp = Boolean(attributes.icon);
  const rawChildren = node.getText(sourceFile);

  const isCheckboxCol =
    /<(?:Checkbox\b|input[^>]*type=["']checkbox["'])/i.test(rawChildren) ||
    /toggleSelect/i.test(rawChildren) ||
    /selectedEmails|selectedIds|selectedLeadIds/i.test(rawChildren) ||
    (attributes.resizable?.initializer?.getText(sourceFile) === "{false}" && /checkbox/i.test(rawChildren));

  if (config.rules?.["table-head-icon-required"] !== "off" && !hasIconProp && !isCheckboxCol) {
    addViolation(
      filePath,
      pos.line,
      pos.col,
      "table-head-icon-required",
      "<TableHead> is missing mandatory 'icon' prop (e.g. icon={<SomeIcon size={20} />}). All table headers must provide an icon component via the 'icon' prop.",
      lineSnippet
    );
  }

  if (config.rules?.["table-resizable-required"] !== "off" && attributes.resizable && attributes.resizable.initializer) {
    const resizableVal = attributes.resizable.initializer.getText(sourceFile);
    if (resizableVal === "{false}" && !isCheckboxCol) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "table-resizable-required",
        "Table column header '<TableHead>' has disabled resizable columns with 'resizable={false}'. All data table columns must support column resizing.",
        lineSnippet
      );
    }
  }

  if (config.rules?.["table-no-horizontal-stacking"] !== "off") {
    if (/(?:email\s*(?:&|\/)\s*deliverability|deliverability\s*(?:&|\/)\s*email|pages\s*(?:&|\/)\s*dupes|warmup\s*(?:&|\/)\s*deliverability)/i.test(rawChildren)) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "table-no-horizontal-stacking",
        "Combined column header detected in '<TableHead>'. Distinct metadata attributes must each reside in their own dedicated, resizable column with a distinct icon.",
        lineSnippet
      );
    }
  }
}

function checkTableBodyInvariants(
  attributes: Record<string, any>,
  pos: { line: number; col: number },
  filePath: string,
  addViolation: AddViolationFn,
  lineSnippet: string,
  sourceFile: ts.SourceFile
) {
  if (attributes.className) {
    const classStrings = extractClassNames(attributes.className.initializer, sourceFile);
    classStrings.forEach(({ text }) => {
      if (/\bdivide-y\b/.test(text)) {
        addViolation(
          filePath,
          pos.line,
          pos.col,
          "table-no-divide-y",
          "Disallowed 'divide-y' detected on '<TableBody>'. In our design system, TableRow natively implements single 'border-b border-neutral-200'. Using 'divide-y' produces double stroke borders.",
          lineSnippet
        );
      }
    });
  }
}

function checkTableCellInvariants(
  node: ts.Node,
  attributes: Record<string, any>,
  pos: { line: number; col: number },
  filePath: string,
  addViolation: AddViolationFn,
  lineSnippet: string,
  sourceFile: ts.SourceFile,
  config: DseConfig
) {
  if (attributes && attributes.colSpan) return;

  const childrenText = node.getText(sourceFile);
  let hasVerticalStack = false;
  let directBlockCount = 0;

  if ((node as any).children) {
    (node as any).children.forEach((child: ts.Node) => {
      if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) {
        const tag = getJsxTagName(child, sourceFile);
        if (tag && ["div", "p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
          directBlockCount++;
        }
      }
    });
  }

  function inspectCellDescendant(child: ts.Node) {
    if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) {
      const childTag = getJsxTagName(child, sourceFile);
      const childAttrs = getJsxAttributes(child, sourceFile);

      if (childAttrs.className) {
        const classes = extractClassNames(childAttrs.className.initializer, sourceFile);
        classes.forEach(({ text }) => {
          if (/\b(?:flex-col|grid-cols-1|space-y-\d+)\b/.test(text)) {
            hasVerticalStack = true;
          }
        });
      }

      if (config.rules?.["table-uniform-typography"] !== "off") {
        const isExempt = childTag && ["Button", "IconButton", "ButtonyIcon", "Chip", "Badge", "Input", "Skeleton"].includes(childTag);
        if (!isExempt && childAttrs.className) {
          const classes = extractClassNames(childAttrs.className.initializer, sourceFile);
          classes.forEach(({ text }) => {
            const tokens = splitClassString(text);
            tokens.forEach((t) => {
              const dec = decomposeToken(t);
              if (!dec) return;

              if (/^text-neutral-(?:400|500|600|700|800)$/.test(dec.core)) {
                const childPos = getNodePosition(sourceFile, child);
                addViolation(
                  filePath,
                  childPos.line,
                  childPos.col,
                  "table-uniform-typography",
                  `Mismatched table text styling '${dec.core}' inside '<TableCell>'. Text in tables must use uniform styling ('text-text-primary').`,
                  lineSnippet
                );
              }

              if (/^text-(?:xs|2xs|base|lg|xl|2xl|3xl|4xl|5xl|\[[0-9]+px\])$/.test(dec.core)) {
                const childPos = getNodePosition(sourceFile, child);
                addViolation(
                  filePath,
                  childPos.line,
                  childPos.col,
                  "table-uniform-typography",
                  `Mismatched table text size '${dec.core}' inside '<TableCell>'. In tables, all fonts must have standard 14px size ('text-sm').`,
                  lineSnippet
                );
              }
            });
          });
        }
      }
    }
    ts.forEachChild(child, inspectCellDescendant);
  }

  if ((node as any).children) {
    (node as any).children.forEach(inspectCellDescendant);
  }

  if (config.rules?.["table-no-cell-stacking"] !== "off") {
    if (hasVerticalStack || directBlockCount > 1) {
      if (!childrenText.includes("dse-ignore-stack")) {
        addViolation(
          filePath,
          pos.line,
          pos.col,
          "table-no-cell-stacking",
          "Stacked text or metadata items detected inside '<TableCell>'. In our design system, vertical stacking of metadata inside table rows is prohibited. Every piece of metadata must reside in its own dedicated column.",
          lineSnippet
        );
      }
    }
  }

  if (config.rules?.["table-no-horizontal-stacking"] !== "off") {
    if (
      /(?:flex\s+items-center|inline-flex|flex-row|items-center\s+gap)/.test(childrenText) &&
      /<(?:Chip|Badge)\b/.test(childrenText) &&
      /<(?:span|div|p)\b[^>]*>(?:(?!<\/(?:span|div|p)>)[\s\S])*?(?:email|\.email|\{cEmail\}|\{item\.email\}|@)[^<]*?<\/(?:span|div|p)>/i.test(childrenText) &&
      !childrenText.includes("dse-ignore-stack")
    ) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "table-no-horizontal-stacking",
        "Horizontal stacking of primary text and metadata status chip detected inside '<TableCell>'. Distinct metadata must reside in dedicated columns.",
        lineSnippet
      );
    }
  }
}

function checkTableFileInvariants(
  filePath: string,
  content: string,
  addViolation: AddViolationFn,
  fileImports: Record<string, string>,
  hasTable: boolean,
  hasTableHeader: boolean,
  hasTableHead: boolean,
  hasTableBody: boolean,
  hasTableRow: boolean,
  hasTableCell: boolean,
  usesColumnHeader: boolean,
  usesResizeDivider: boolean,
  usesResizableHook: boolean,
  config: DseConfig
) {
  if (config.rules?.["table-resizable-required"] !== "off") {
    const usesTablePrimitivesWithoutTable = (usesColumnHeader || usesResizeDivider || usesResizableHook) && !hasTable;
    if (usesTablePrimitivesWithoutTable) {
      addViolation(
        filePath,
        1,
        1,
        "table-resizable-required",
        "Ad-hoc div table detected. Constructing custom data grids without using the official '<Table>' suite is prohibited. Use <Table>, <TableHeader>, <TableHead>, <TableBody>, <TableRow>, and <TableCell>.",
        ""
      );
    }
  }

  if (hasTable && config.rules?.["table-single-border"] !== "off") {
    if (/<div\b[^>]*\b(?:border\b|border-stroke|border-neutral)\b[^>]*>\s*<Table\b/.test(content)) {
      addViolation(
        filePath,
        1,
        1,
        "table-single-border",
        "Redundant outer border wrapper detected immediately surrounding '<Table>'. The '<Table>' component natively provides the official standard container. Remove redundant outer border wrapper.",
        ""
      );
    }
  }

  if (hasTable && config.rules?.["table-windowed-pagination"] !== "off") {
    const normFilePath = filePath.replace(/\\/g, "/");
    const isExcludedFromPagination =
      normFilePath.includes("components/ui/table.tsx") ||
      normFilePath.includes("components/settings/") ||
      normFilePath.includes("app/(dashboard)/settings") ||
      normFilePath.includes("lead-import-modal.tsx") ||
      content.includes("dse-ignore-pagination");

    if (!isExcludedFromPagination) {
      const hasPagination =
        /paginate|safe[A-Z0-9_]*Page|currentPage|leadPage|sessionPage|campPage|total[A-Z0-9_]*Pages|pageSize|Dropdown[^>]*options=.*(?:10|25|50|100)/i.test(content) ||
        /Showing\s+[\s\S]*?\bto\b[\s\S]*?\bof\b/i.test(content);

      if (!hasPagination) {
        addViolation(
          filePath,
          1,
          1,
          "table-windowed-pagination",
          "Data table in '<Table>' is missing windowed pagination controls. Tables rendering collections must support pagination with page size selector, Previous/Next buttons, and range indicator.",
          ""
        );
      }
    }
  }
}

function checkTabsElement(
  attributes: Record<string, any>,
  pos: { line: number; col: number },
  filePath: string,
  addViolation: AddViolationFn,
  lineSnippet: string,
  fileImports: Record<string, string>
) {
  const normPath = filePath.replace(/\\/g, "/");
  if (normPath.endsWith("components/ui/tabs.tsx")) return;

  if (!attributes.items) {
    addViolation(
      filePath,
      pos.line,
      pos.col,
      "tabs-component-required",
      "<Tabs> is missing mandatory 'items' prop. All Tabs components must provide an array of items [{ id, label, icon?, badge?, count?, disabled? }].",
      lineSnippet
    );
  }
}

function checkPseudoChips(
  tagName: string,
  attributes: Record<string, any>,
  pos: { line: number; col: number },
  filePath: string,
  addViolation: AddViolationFn,
  lineSnippet: string,
  sourceFile: ts.SourceFile
) {
  const normPath = filePath.replace(/\\/g, "/");
  if (normPath.endsWith("components/ui/chip.tsx") || normPath.endsWith("components/ui/badge.tsx")) return;

  if (!attributes.className) return;

  const classStrings = extractClassNames(attributes.className.initializer, sourceFile);
  classStrings.forEach(({ text }) => {
    const tokens = text.split(/\s+/);
    const hasStaticBg = tokens.some((t) => /^(?:dark:)?bg-(?:neutral|emerald|amber|red|blue)-\d+/.test(t));
    const hasRadius = tokens.some((t) => /^(?:rounded-md|rounded-full)$/.test(t));
    const hasPadding = tokens.some((t) => /^(?:px-(?:1|1\.5|2|2\.5|3)|p-(?:0\.5|1))$/.test(t));

    if (hasStaticBg && hasRadius && hasPadding && !lineSnippet.includes("dse-ignore-chip")) {
      addViolation(
        filePath,
        pos.line,
        pos.col,
        "no-pseudo-chips",
        `Pseudo-chip detected on '<${tagName}>'. Never use raw <span> or <div> elements styled with background fills and rounded corners to emulate chips. Use the standard '<Chip>' component.`,
        lineSnippet
      );
    }
  });
}

function checkElementClasses(
  node: ts.Node,
  tagName: string,
  attributes: Record<string, any>,
  pos: { line: number; col: number },
  filePath: string,
  addViolation: AddViolationFn,
  sourceFile: ts.SourceFile,
  config: DseConfig
) {
  if (!attributes.className) return;

  const isButton = ["Button", "IconButton", "ButtonyIcon", "FloatingActionButton"].includes(tagName);
  const isCheckbox =
    tagName === "Checkbox" ||
    attributes.type?.initializer?.getText(sourceFile)?.includes("checkbox") ||
    attributes.role?.initializer?.getText(sourceFile)?.includes("checkbox") ||
    Boolean(attributes["aria-checked"]) ||
    (attributes.className && /\b(?:size-5|w-5\s+h-5)\b/.test(attributes.className.rawText));

  const lineSnippet = sourceFile.getFullText().split("\n")[pos.line - 1] || "";
  const classStrings = extractClassNames(attributes.className.initializer, sourceFile);

  classStrings.forEach(({ text, node: stringNode }) => {
    const tokens = splitClassString(text);
    tokens.forEach((rawToken) => {
      const dec = decomposeToken(rawToken);
      if (!dec) return;

      const nodePos = stringNode ? getNodePosition(sourceFile, stringNode) : pos;

      // Typography checks
      const typoViolations = evaluateTypographyToken(dec.core, config.tokens?.typography);
      typoViolations.forEach((v) => {
        if (config.rules?.[v.rule as keyof typeof config.rules] !== "off") {
          addViolation(filePath, nodePos.line, nodePos.col, v.rule, v.message, lineSnippet);
        }
      });

      // Geometry checks
      const geoViolations = evaluateGeometryToken(dec.core, config.tokens?.geometry, isCheckbox);
      geoViolations.forEach((v) => {
        if (config.rules?.[v.rule as keyof typeof config.rules] !== "off") {
          addViolation(filePath, nodePos.line, nodePos.col, v.rule, v.message, lineSnippet);
        }
      });

      // Color checks
      const colorViolations = evaluateColorToken(dec.core, config.tokens?.colors);
      colorViolations.forEach((v) => {
        if (config.rules?.[v.rule as keyof typeof config.rules] !== "off") {
          addViolation(filePath, nodePos.line, nodePos.col, v.rule, v.message, lineSnippet);
        }
      });

      // Control height check (Buttons, Controls)
      if (isButton && config.rules?.["control-height-max"] !== "off") {
        if (/\bh-(?:10|11|12|14|16|\[(?:3[8-9]|[4-9][0-9]|[1-9][0-9]{2,})px\])\b/.test(dec.core)) {
          addViolation(
            filePath,
            nodePos.line,
            nodePos.col,
            "control-height-max",
            `Disallowed button height '${dec.core}'. Interactive buttons and controls must standardise on max 36px height ('h-[36px]' or 'h-9').`,
            lineSnippet
          );
        }
      }
    });
  });
}
