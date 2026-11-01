type RuleSeverity = "error" | "warn" | "off";
interface ComponentReplacement {
    replaceWith: string;
    importFrom?: string;
    checkRawElement?: boolean;
}
interface TypographyConfig {
    minFontSize?: string;
    maxFontSize?: string;
    maxFontWeight?: number;
    disallowArbitrarySizes?: boolean;
    disallowUppercase?: boolean;
    allowXsOn?: string[];
}
interface GeometryConfig {
    maxControlHeight?: number | string;
    allowedRadii?: string[];
    radiiExceptions?: Record<string, string[]>;
}
interface ColorsConfig {
    bannedColorFamilies?: string[];
    disallowRawHex?: boolean;
    disallowButtonChipColors?: boolean;
    disallowSaturatedGradients?: boolean;
}
interface ComponentsConfig {
    disallowRawHtml?: Record<string, ComponentReplacement>;
    disallowPseudoChips?: boolean;
    requiredInventory?: Array<{
        name: string;
        componentName?: string;
        altNames?: string[];
        importPath?: string;
    }>;
}
interface RulesConfig {
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
}
interface DseConfig {
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
interface Violation {
    file: string;
    line: number;
    col: number;
    rule: string;
    severity: "error" | "warn";
    message: string;
    snippet?: string;
}
interface ScanResult {
    violations: Violation[];
    scannedFilesCount: number;
    errorCount: number;
    warningCount: number;
    componentInventory: Record<string, {
        active: boolean;
        fileCount: number;
    }>;
}

declare function defineConfig(config: DseConfig): DseConfig;
declare function loadConfig(cwd?: string, customPath?: string): Promise<DseConfig>;

declare const berserkPreset: DseConfig;

declare const defaultPreset: DseConfig;

declare function runDseScan(config: DseConfig, cwd?: string): Promise<ScanResult>;

declare function formatStylish(result: ScanResult): string;

declare function formatJson(result: ScanResult): string;

declare function scaffoldConfig(cwd?: string, preset?: string): string;
declare function scaffoldTokens(cwd?: string): {
    tokensPath: string;
    cssPath: string;
};
declare function scaffoldComponent(componentName: string, cwd?: string): string | null;
declare function scaffoldAllPrimitives(cwd?: string): string[];

declare function generateMarkdownRules(config: DseConfig): string;

/**
 * Programmatic scan API for running DSE inside tests, Vite plugins, or Next.js dev server overlays.
 */
declare function scanProject(options?: {
    config?: DseConfig;
    configPath?: string;
    cwd?: string;
}): Promise<ScanResult>;

export { type ColorsConfig, type ComponentReplacement, type ComponentsConfig, type DseConfig, type GeometryConfig, type RuleSeverity, type RulesConfig, type ScanResult, type TypographyConfig, type Violation, berserkPreset, defaultPreset, defineConfig, formatJson, formatStylish, generateMarkdownRules, loadConfig, runDseScan, scaffoldAllPrimitives, scaffoldComponent, scaffoldConfig, scaffoldTokens, scanProject };
