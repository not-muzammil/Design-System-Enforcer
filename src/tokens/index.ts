import type { TypographyConfig, GeometryConfig, ColorsConfig } from "../config/types.js";

export interface DecomposedToken {
  raw: string;
  core: string;
  variants: string[];
}

export interface TokenViolation {
  rule: string;
  message: string;
}

/**
 * Splits a class string (including multiline whitespace) into distinct token strings.
 */
export function splitClassString(str?: string | null): string[] {
  if (!str || typeof str !== "string") return [];
  return str.split(/\s+/).filter(Boolean);
}

/**
 * Decomposes a Tailwind token into variants and core token.
 * e.g. "hover:focus:md:text-xs" -> { variants: ["hover", "focus", "md"], core: "text-xs" }
 */
export function decomposeToken(rawToken?: string | null): DecomposedToken | null {
  if (!rawToken || typeof rawToken !== "string") return null;

  const parts: string[] = [];
  let bracketDepth = 0;
  let current = "";

  for (let i = 0; i < rawToken.length; i++) {
    const char = rawToken[i];
    if (char === "[" || char === "(") {
      bracketDepth++;
      current += char;
    } else if (char === "]" || char === ")") {
      bracketDepth = Math.max(0, bracketDepth - 1);
      current += char;
    } else if (char === ":" && bracketDepth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current) parts.push(current);

  const core = parts.pop() || "";
  const variants = parts;

  return { raw: rawToken, core, variants };
}

/**
 * Checks a core token for typography violations.
 */
export function evaluateTypographyToken(core: string, config?: TypographyConfig): TokenViolation[] {
  const violations: TokenViolation[] = [];
  const minFont = config?.minFontSize || "14px";
  const maxFont = config?.maxFontSize || "32px";
  const maxWeight = config?.maxFontWeight ?? 500;
  const disallowArbitrary = config?.disallowArbitrarySizes ?? true;
  const disallowUppercase = config?.disallowUppercase ?? true;

  // 1. Font size < 14px (or configured min)
  if (/^text-(?:xs|2xs)$/.test(core)) {
    violations.push({
      rule: "font-size-min",
      message: `Disallowed font size '${core}' is smaller than ${minFont}. Primary body font must strictly be standard ${minFont} ('text-sm').`,
    });
  }

  // 2. Arbitrary bracket sizes: text-[...]
  const arbitrarySizeMatch = core.match(/^text-\[(\d+(?:\.\d+)?)(px|rem|em)\]$/);
  if (arbitrarySizeMatch) {
    const num = parseFloat(arbitrarySizeMatch[1]);
    const unit = arbitrarySizeMatch[2];
    const pxVal = unit === "rem" || unit === "em" ? num * 16 : num;

    if (pxVal < 14) {
      violations.push({
        rule: "font-size-min",
        message: `Disallowed arbitrary font size '${core}' (${pxVal}px) is below minimum allowed size (${minFont}).`,
      });
    } else if (pxVal > 32) {
      violations.push({
        rule: "font-size-max",
        message: `Disallowed arbitrary font size '${core}' (${pxVal}px) exceeds maximum allowed heading size (${maxFont}).`,
      });
    } else if (disallowArbitrary) {
      violations.push({
        rule: "no-arbitrary-text-size",
        message: `Arbitrary font size '${core}' is prohibited. Use standard typography tokens ('text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl').`,
      });
    }
  }

  // 3. Font sizes exceeding 32px
  if (/^text-(?:3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/.test(core)) {
    violations.push({
      rule: "font-size-max",
      message: `Disallowed font size '${core}' exceeds maximum allowed heading cap of ${maxFont}.`,
    });
  }

  // 4. Font weight exceeding Medium (500)
  if (maxWeight <= 500) {
    if (/^font-(?:semibold|bold|extrabold|black)$/.test(core)) {
      violations.push({
        rule: "font-weight-max",
        message: `Disallowed font weight '${core}' exceeds maximum allowed weight (500 / Medium).`,
      });
    }
    const arbitraryWeightMatch = core.match(/^font-\[(\d+)\]$/);
    if (arbitraryWeightMatch) {
      const weight = parseInt(arbitraryWeightMatch[1], 10);
      if (weight > maxWeight) {
        violations.push({
          rule: "font-weight-max",
          message: `Disallowed arbitrary font weight '${core}' (${weight}) exceeds maximum allowed weight (${maxWeight} / Medium).`,
        });
      }
    }
  }

  // 5. Uppercase text transformation
  if (disallowUppercase && core === "uppercase") {
    violations.push({
      rule: "no-uppercase-text",
      message: `CSS text transformation '${core}' is disallowed. Use standard sentence case or title case.`,
    });
  }

  return violations;
}

/**
 * Checks a core token for geometry & corner radius violations.
 */
export function evaluateGeometryToken(core: string, config?: GeometryConfig, isCheckbox = false): TokenViolation[] {
  const violations: TokenViolation[] = [];
  const allowedRadii = new Set(config?.allowedRadii || ["0", "0px", "8px", "12px", "16px", "9999px", "100%"]);
  const checkboxRadii = new Set(config?.radiiExceptions?.Checkbox || ["0", "0px", "4px", "0.25rem", "8px", "12px", "16px", "9999px", "100%"]);

  // Standard corner radius classes
  if (/^rounded(?:-(?:xs|sm|md|lg|xl|2xl|3xl|none|full))?$/.test(core)) {
    if (core === "rounded-xs" || core === "rounded") {
      if (!isCheckbox) {
        violations.push({
          rule: "corner-radius-allowed",
          message: `4px corner radius ('${core}') is strictly reserved for checkboxes only. Standard components must use 'rounded-md' (8px) or 'rounded-lg' (12px).`,
        });
      }
    } else if (core === "rounded-2xl" || core === "rounded-3xl") {
      violations.push({
        rule: "corner-radius-allowed",
        message: `Oversized corner radius '${core}' is disallowed. Standard components must use 'rounded-md' (8px) or 'rounded-lg' (12px).`,
      });
    }
  }

  // Arbitrary radius: rounded-[...]
  const radiusMatch = core.match(/^rounded(?:-[trblse])?-\[([^\]]+)\]$/);
  if (radiusMatch) {
    const val = radiusMatch[1].trim();
    const effectiveSet = isCheckbox ? checkboxRadii : allowedRadii;
    if (!effectiveSet.has(val)) {
      violations.push({
        rule: "corner-radius-allowed",
        message: `Disallowed arbitrary corner radius '${core}' (${val}). Allowed values: ${Array.from(effectiveSet).join(", ")}.`,
      });
    }
  }

  return violations;
}

/**
 * Checks a core token for color palette violations.
 */
export function evaluateColorToken(core: string, config?: ColorsConfig): TokenViolation[] {
  const violations: TokenViolation[] = [];
  const bannedFamilies = new Set(config?.bannedColorFamilies || []);

  if (bannedFamilies.size > 0) {
    // Matches bg-purple-500, text-indigo-600, border-violet-400, from-purple-600, to-indigo-600, via-pink-500
    const colorMatch = core.match(/^(?:bg|text|border|ring|stroke|fill|from|to|via)-([a-z]+)-[0-9]{2,3}$/);
    if (colorMatch) {
      const family = colorMatch[1];
      if (bannedFamilies.has(family)) {
        violations.push({
          rule: "no-banned-colors",
          message: `Disallowed off-palette color class '${core}'. Color family '${family}' (purple, indigo, violet, etc.) is not permitted in our design system.`,
        });
      }
    }
  }

  // Cheesy AI Gradient Checks
  if (config?.disallowSaturatedGradients) {
    if (core === "bg-clip-text" || core === "text-transparent") {
      violations.push({
        rule: "no-unapproved-gradients",
        message: `Gradient text styling '${core}' detected. Cheesy AI gradient text is prohibited. Use standard high-contrast text typography.`,
      });
    }
  }

  return violations;
}
