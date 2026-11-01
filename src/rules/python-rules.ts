import type { DseConfig } from "../config/types.js";
import type { AddViolationFn } from "./types.js";

function isInsidePythonString(line: string, index: number): boolean {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < index; i++) {
    const char = line[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === "'" && !inDouble) inSingle = !inSingle;
    if (char === '"' && !inSingle) inDouble = !inDouble;
  }
  return inSingle || inDouble;
}

/**
 * Rules engine specifically adapted for Python (.py), HTML (.html, .jinja), and CSS (.css) files.
 */
export function runPythonRules(
  content: string,
  filePath: string,
  addViolation: AddViolationFn,
  config: DseConfig
): void {
  const lines = content.split("\n");
  const isPython = filePath.endsWith(".py");
  const isCssOrHtml = filePath.endsWith(".css") || filePath.endsWith(".html") || filePath.endsWith(".jinja") || filePath.endsWith(".jinja2");

  const unicodeArrowRegex = /[\u2190-\u2199\u21D0-\u21D9\u2794-\u27BF\u21B0-\u21B5\u27F5-\u27FF]|(?:->|<-)/gu;
  const hexColorRegex = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

  // Track if we are inside a CSS block or multiline string
  let inStyleBlock = false;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Check ignore comments
    if (line.includes("dse-ignore") || trimmed.startsWith("#") || trimmed.startsWith("//") || trimmed.startsWith("/*")) {
      return;
    }

    // Strip inline comments before checks so #ff0000 in python comments or /* #fff */ is ignored
    const codeOnlyLine = isPython
      ? line.replace(/#.*$/, "")
      : line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "");

    // Track <style> blocks (e.g. in Streamlit st.markdown("""<style>...""") or HTML)
    if (line.includes("<style>")) inStyleBlock = true;
    if (line.includes("</style>")) inStyleBlock = false;

    // 1. Text Arrow Check
    if (config.rules?.["no-text-arrows"] !== "off") {
      unicodeArrowRegex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = unicodeArrowRegex.exec(codeOnlyLine)) !== null) {
        const arrow = match[0];

        // In Python files, '->' outside string literals is ALWAYS a function return type hint:
        // e.g. def foo() -> int:, ) -> list:, ) -> Groq:, Callable[..., Any] -> None
        if (isPython && arrow === "->" && !isInsidePythonString(line, match.index)) {
          continue; // Skip Python type annotations
        }

        // Only check arrows inside strings or UI copy
        addViolation(
          filePath,
          lineNum,
          match.index + 1,
          "no-text-arrows",
          `Raw text arrow '${arrow}' detected. Use design system icon components instead of raw arrows.`,
          line
        );
      }
    }

    // 2. CSS Invariant Checks (inside <style> blocks or .css files)
    if (inStyleBlock || isCssOrHtml) {
      // Font size checks: font-size: 11px
      const fontSizeMatch = line.match(/font-size\s*:\s*(\d+(?:\.\d+)?)(px|rem)/i);
      if (fontSizeMatch) {
        const val = parseFloat(fontSizeMatch[1]);
        const unit = fontSizeMatch[2].toLowerCase();
        const px = unit === "rem" ? val * 16 : val;

        if (px < 14 && config.rules?.["font-size-min"] !== "off") {
          addViolation(
            filePath,
            lineNum,
            fontSizeMatch.index || 1,
            "font-size-min",
            `Disallowed font-size '${fontSizeMatch[0]}' (${px}px) is smaller than 14px. Primary body font must strictly be standard 14px.`,
            line
          );
        } else if (px > 32 && config.rules?.["font-size-max"] !== "off") {
          addViolation(
            filePath,
            lineNum,
            fontSizeMatch.index || 1,
            "font-size-max",
            `Disallowed font-size '${fontSizeMatch[0]}' (${px}px) exceeds maximum allowed heading cap of 32px.`,
            line
          );
        }
      }

      // Font weight checks: font-weight: 600 / bold
      const fontWeightMatch = line.match(/font-weight\s*:\s*([0-9]{3}|bold|bolder|semibold)/i);
      if (fontWeightMatch && config.rules?.["font-weight-max"] !== "off") {
        const rawWeight = fontWeightMatch[1].toLowerCase();
        const weightNum = parseInt(rawWeight, 10);
        if (weightNum > 500 || ["bold", "bolder", "semibold"].includes(rawWeight)) {
          addViolation(
            filePath,
            lineNum,
            fontWeightMatch.index || 1,
            "font-weight-max",
            `Disallowed font-weight '${fontWeightMatch[0]}'. Font weight must not exceed Medium (500).`,
            line
          );
        }
      }

      // Backdrop blur
      if (config.rules?.["no-backdrop-blur"] !== "off" && /backdrop-filter\s*:\s*blur/i.test(line)) {
        addViolation(
          filePath,
          lineNum,
          1,
          "no-backdrop-blur",
          "Disallowed backdrop blur filter detected in styles. Backdrop blur is prohibited across the design system.",
          line
        );
      }
    }

    // 3. Raw Hex Color checks (in styling contexts or UI definitions)
    if (config.rules?.["no-raw-hex-colors"] !== "off") {
      hexColorRegex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = hexColorRegex.exec(line)) !== null) {
        const hex = match[0];
        // Flag hex colors in styling, CSS, or UI color definitions
        if (inStyleBlock || isCssOrHtml || /(?:color|background|bg|border|fill|stroke|theme)\s*[:=]/i.test(line)) {
          addViolation(
            filePath,
            lineNum,
            match.index + 1,
            "no-raw-hex-colors",
            `Raw hex color '${hex}' detected. Centralize theme colors in configuration or CSS variables instead of hardcoded hex values.`,
            line
          );
        }
      }
    }
  });
}

