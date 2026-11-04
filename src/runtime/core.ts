export interface RuntimeViolation {
  techStack: string;
  rule: string;
  message: string;
  elementOrComponent?: string;
  receivedValue?: any;
}

export class DesignSystemRuntimeError extends Error {
  public techStack: string;
  public rule: string;
  public receivedValue?: any;

  constructor(violation: RuntimeViolation) {
    const banner = `\n========================================================\n[DSE RUNTIME ERROR: ${violation.techStack.toUpperCase()}]\n========================================================\nRule: ${violation.rule}\n${violation.message}\n${violation.receivedValue ? `Received Value: ${JSON.stringify(violation.receivedValue)}\n` : ""}========================================================\n`;
    super(banner);
    this.name = "DesignSystemRuntimeError";
    this.techStack = violation.techStack;
    this.rule = violation.rule;
    this.receivedValue = violation.receivedValue;
  }
}

/**
 * Universal color and styling invariant validator
 */
export function assertValidStyles(
  classesOrStyles: string | Record<string, any> | undefined,
  componentName: string,
  techStack: "react" | "next" | "astro" | "vue" | "svelte" | "python" = "react"
): void {
  if (!classesOrStyles) return;

  // 1. String classes check
  if (typeof classesOrStyles === "string") {
    // Check for hardcoded inline hex colors
    const hexMatch = classesOrStyles.match(/#(?:[0-9a-fA-F]{3,8})\b/);
    if (hexMatch) {
      throw new DesignSystemRuntimeError({
        techStack,
        rule: "no-hardcoded-colors",
        message: `Hardcoded hex color '${hexMatch[0]}' rendered in <${componentName}>. All colors must use design system tokens ('var(--primary)', 'neutral-*').`,
        elementOrComponent: componentName,
        receivedValue: hexMatch[0],
      });
    }

    // Check for raw off-palette colors in application code (e.g. bg-blue-500, text-purple-600)
    const rawColorMatch = classesOrStyles.match(/\b(?:bg|text|border)-(?:blue|indigo|purple|violet|pink|fuchsia|cyan|teal|rose)-[0-9]{2,3}\b/);
    if (rawColorMatch) {
      throw new DesignSystemRuntimeError({
        techStack,
        rule: "no-hardcoded-colors",
        message: `Hardcoded color utility '${rawColorMatch[0]}' rendered in <${componentName}>. Colors outside design system tokens are strictly forbidden.`,
        elementOrComponent: componentName,
        receivedValue: rawColorMatch[0],
      });
    }

    // Check for text-wrapping on compact buttons/chips
    const isCompact = ["Button", "IconButton", "Chip", "Badge", "Tab", "TableHead"].includes(componentName);
    if (isCompact && /\b(?:whitespace-normal|whitespace-pre-wrap|flex-wrap)\b/.test(classesOrStyles)) {
      throw new DesignSystemRuntimeError({
        techStack,
        rule: "no-wrapping-compact-elements",
        message: `Disallowed text wrapping class detected on compact component <${componentName}>. Compact elements must include 'whitespace-nowrap shrink-0'.`,
        elementOrComponent: componentName,
        receivedValue: classesOrStyles,
      });
    }
  }

  // 2. Inline style object check (e.g. style={{ color: '#ff0000' }})
  if (typeof classesOrStyles === "object") {
    for (const [prop, val] of Object.entries(classesOrStyles)) {
      if (typeof val === "string") {
        if (/#(?:[0-9a-fA-F]{3,8})\b/.test(val) || /^rgb/i.test(val)) {
          throw new DesignSystemRuntimeError({
            techStack,
            rule: "no-hardcoded-colors",
            message: `Inline hardcoded style '${prop}: ${val}' rendered on <${componentName}>. Colors must reference CSS variables (e.g. 'var(--primary)').`,
            elementOrComponent: componentName,
            receivedValue: { [prop]: val },
          });
        }
      }
    }
  }
}

