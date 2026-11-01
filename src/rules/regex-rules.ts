import type { DseConfig } from "../config/types.js";
import type { AddViolationFn } from "./types.js";

export function runRegexRules(
  content: string,
  filePath: string,
  addViolation: AddViolationFn,
  config: DseConfig
): void {
  const lines = content.split("\n");
  // Only match actual Unicode arrows and ASCII arrows like -> or <-, NOT JS arrow functions '=>'
  const unicodeArrowRegex = /[\u2190-\u2199\u21D0-\u21D9\u2794-\u27BF\u21B0-\u21B5\u27F5-\u27FF]|(?:->|<-)/gu;
  const hexColorRegex = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
  const backdropBlurRegex = /\bbackdrop-blur(?:-[a-z0-9]+)?\b/g;

  // Track button tags across lines
  let inButtonTag = false;
  const disallowedButtonColorRegex = /(?:bg-(?:emerald|green|red|amber|rose|pink|purple|indigo)-[0-9]{2,3}|border-(?:emerald|green|red|amber|rose|pink|purple|indigo)-[0-9]{2,3})\b|variant=["'](?:danger|success|warning|error)["']/g;
  const buttonOpenRegex = /<(?:Button|IconButton|FloatingActionButton|ButtonyIcon)\b/g;
  const buttonCloseRegex = /<\/(?:Button|IconButton|FloatingActionButton|ButtonyIcon)>/g;
  const buttonSelfCloseRegex = /<(?:Button|IconButton|FloatingActionButton|ButtonyIcon)\b[^>]*\/>/g;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (line.includes("dse-ignore") || trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      return;
    }

    // 1. Arrow symbols
    if (config.rules?.["no-text-arrows"] !== "off") {
      unicodeArrowRegex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = unicodeArrowRegex.exec(line)) !== null) {
        addViolation(
          filePath,
          lineNum,
          match.index + 1,
          "no-text-arrows",
          `Raw text/ASCII arrow '${match[0]}' detected. Disallowed in UI; use design system icon components instead.`,
          line
        );
      }
    }

    // 2. Backdrop blur
    if (config.rules?.["no-backdrop-blur"] !== "off") {
      backdropBlurRegex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = backdropBlurRegex.exec(line)) !== null) {
        addViolation(
          filePath,
          lineNum,
          match.index + 1,
          "no-backdrop-blur",
          `Disallowed backdrop blur '${match[0]}' detected. Backdrop blur is prohibited across the design system.`,
          line
        );
      }
    }

    // 3. Raw hex colors
    if (config.rules?.["no-raw-hex-colors"] !== "off") {
      hexColorRegex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = hexColorRegex.exec(line)) !== null) {
        const hex = match[0];
        // Allow pure black/white if explicitly permitted or in SVG data
        if (!line.includes("svg") && !line.includes("xmlns")) {
          addViolation(
            filePath,
            lineNum,
            match.index + 1,
            "no-raw-hex-colors",
            `Raw hex color '${hex}' detected. Use theme tokens or CSS variables instead of hardcoded hex values.`,
            line
          );
        }
      }
    }

    // 4. Button chip colors across multi-line tags
    if (config.rules?.["no-chip-colored-buttons"] !== "off") {
      buttonOpenRegex.lastIndex = 0;
      if (buttonOpenRegex.test(line)) {
        inButtonTag = true;
      }

      if (inButtonTag) {
        disallowedButtonColorRegex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = disallowedButtonColorRegex.exec(line)) !== null) {
          if (!line.includes("dse-ignore-button-color")) {
            addViolation(
              filePath,
              lineNum,
              match.index + 1,
              "no-chip-colored-buttons",
              `Disallowed chip color '${match[0]}' applied to Button. Buttons must never use semantic chip colors.`,
              line
            );
          }
        }

        buttonCloseRegex.lastIndex = 0;
        buttonSelfCloseRegex.lastIndex = 0;
        if (buttonCloseRegex.test(line) || buttonSelfCloseRegex.test(line) || line.includes(">")) {
          inButtonTag = false;
        }
      }
    }
  });
}
