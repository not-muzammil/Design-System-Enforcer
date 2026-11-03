export type RuleSeverity = "error" | "warn" | "off";

export interface ComponentReplacement {
  replaceWith: string;
  importFrom?: string;
  checkRawElement?: boolean;
}

export interface TypographyConfig {
  minFontSize?: string; // e.g. "14px"
  maxFontSize?: string; // e.g. "32px"
  maxFontWeight?: number; // e.g. 500
  disallowArbitrarySizes?: boolean;
  disallowUppercase?: boolean;
  allowXsOn?: string[];
}

export interface GeometryConfig {
  maxControlHeight?: number | string; // e.g. 36 or "36px"
  allowedRadii?: string[]; // e.g. ["0px", "8px", "12px", "16px", "9999px"]
  radiiExceptions?: Record<string, string[]>; // e.g. { Checkbox: ["4px"] }
}

export interface ColorsConfig {
  bannedColorFamilies?: string[];
  disallowRawHex?: boolean;
  disallowButtonChipColors?: boolean;
  disallowSaturatedGradients?: boolean;
}

export interface ComponentsConfig {
  disallowRawHtml?: Record<string, ComponentReplacement>;
  disallowPseudoChips?: boolean;
  requiredInventory?: Array<{
    name: string;
    componentName?: string;
    altNames?: string[];
    importPath?: string;
  }>;
}

export interface RulesConfig {
  "font-size-min"?: RuleSeverity;
  "font-size-max"?: RuleSeverity;
  "font-weight-max"?: RuleSeverity;
  "no-arbitrary-text-size"?: RuleSeverity;
  "no-uppercase-text"?: RuleSeverity;
  "control-height-max"?: RuleSeverity;
  "corner-radius-allowed"?: RuleSeverity;
  "no-banned-colors"?: RuleSeverity;
  "no-raw-hex-colors"?: RuleSeverity;
  "no-raw-html-elements"?: RuleSeverity;
  "no-pseudo-chips"?: RuleSeverity;
  "no-chip-colored-buttons"?: RuleSeverity;
  "no-text-arrows"?: RuleSeverity;
  "no-backdrop-blur"?: RuleSeverity;
  "no-unapproved-gradients"?: RuleSeverity;
  "modal-backdrop-standard"?: RuleSeverity;
  "table-resizable-required"?: RuleSeverity;
  "table-head-icon-required"?: RuleSeverity;
  "table-single-border"?: RuleSeverity;
  "table-no-divide-y"?: RuleSeverity;
  "table-uniform-typography"?: RuleSeverity;
  "table-no-cell-stacking"?: RuleSeverity;
  "table-no-horizontal-stacking"?: RuleSeverity;
  "table-windowed-pagination"?: RuleSeverity;
  "tabs-component-required"?: RuleSeverity;
  "component-inventory-active"?: RuleSeverity;
  "no-wrapping-compact-elements"?: RuleSeverity;
}

export interface DseConfig {
  preset?: "berserk" | "recommended" | "minimal" | "python";
  targetDir?: string;
  include?: string[];
  exclude?: string[];
  tokens?: {
    typography?: TypographyConfig;
    geometry?: GeometryConfig;
    colors?: ColorsConfig;
  };
  components?: ComponentsConfig;
  rules?: RulesConfig;
}

export interface Violation {
  file: string;
  line: number;
  col: number;
  rule: string;
  severity: "error" | "warn";
  message: string;
  snippet?: string;
}

export interface ScanResult {
  violations: Violation[];
  scannedFilesCount: number;
  errorCount: number;
  warningCount: number;
  componentInventory: Record<string, { active: boolean; fileCount: number }>;
}

