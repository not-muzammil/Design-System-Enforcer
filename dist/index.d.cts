import React from 'react';

interface RuntimeViolation {
    techStack: string;
    rule: string;
    message: string;
    elementOrComponent?: string;
    receivedValue?: any;
}
declare class DesignSystemRuntimeError extends Error {
    techStack: string;
    rule: string;
    receivedValue?: any;
    constructor(violation: RuntimeViolation);
}
/**
 * Universal color and styling invariant validator
 */
declare function assertValidStyles(classesOrStyles: string | Record<string, any> | undefined, componentName: string, techStack?: "react" | "next" | "astro" | "vue" | "svelte" | "python"): void;

interface DseGuardProps {
    children: React.ReactNode;
    strict?: boolean;
}
/**
 * React / Next.js Runtime Design System Enforcer Guard
 * Throws runtime errors in development if hardcoded colors, raw HTML,
 * or non-compliant design tokens are rendered.
 */
declare const DseGuard: React.FC<DseGuardProps>;

interface AstroPluginOptions {
    strict?: boolean;
}
/**
 * Astro / Vite Runtime & Build Guard Plugin
 * Throws compile/runtime errors when Astro or SSR components introduce hardcoded colors or banned elements.
 */
declare function dseAstroPlugin(options?: AstroPluginOptions): {
    name: string;
    enforce: "pre";
    transform(code: string, id: string): null;
};

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
    minControlHeight?: number | string;
    chipHeight?: number | string;
    minIconSize?: number;
    allowedRadii?: string[];
    radiiExceptions?: Record<string, string[]>;
}
interface ColorsConfig {
    bannedColorFamilies?: string[];
    disallowRawHex?: boolean;
    disallowButtonChipColors?: boolean;
    disallowSaturatedGradients?: boolean;
    disallowHardcodedColors?: boolean;
    colorWhitelistPaths?: string[];
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
    "icon-size-min"?: RuleSeverity;
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
    "no-hardcoded-colors"?: RuleSeverity;
    "no-primitive-geometry-overrides"?: RuleSeverity;
    "no-primitive-style-overrides"?: RuleSeverity;
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

declare function runDseScan(config: DseConfig, cwd?: string): Promise<ScanResult>;

interface CategoryScore {
    name: string;
    category: "typography" | "geometry" | "components" | "colors" | "wrapping" | "tables";
    violations: number;
    score: number;
}
interface DoctorReport {
    overallScore: number;
    grade: "A+" | "A" | "B" | "C" | "D" | "F";
    scannedFiles: number;
    totalViolations: number;
    categories: CategoryScore[];
    fileBreakdown: Array<{
        file: string;
        violations: number;
    }>;
}
declare function computeDoctorScore(result: ScanResult): DoctorReport;

interface FixReport {
    filesFixed: number;
    totalModifications: number;
    details: Array<{
        file: string;
        fixes: string[];
    }>;
}
/**
 * Automatically remediates common Design System Enforcer violations
 */
declare function runDseFix(config: DseConfig, cwd?: string): Promise<FixReport>;

/**
 * Generates AI-optimized instructions specifically tuned for LLMs and coding assistants.
 */
declare function generateAgentInstructions(config: DseConfig): string;
/**
 * Installs a git pre-commit hook in .git/hooks/pre-commit
 */
declare function installPreCommitHook(cwd?: string): boolean;

type Framework = "nextjs" | "vite" | "react-cra" | "remix" | "astro" | "streamlit" | "python-general" | "unknown";
type ComponentLibrary = "shadcn" | "radix" | "tailwind" | "mui" | "chakra" | "lucide" | "none";
interface ProjectInfo {
    root: string;
    isMonorepo: boolean;
    monorepoWorkspaces: string[];
    framework: Framework;
    libraries: ComponentLibrary[];
    hasTailwind: boolean;
    tailwindVersion?: "v3" | "v4";
    hasTypeScript: boolean;
    hasPython: boolean;
    suggestedIncludes: string[];
    suggestedIgnores: string[];
    tokensFile?: string;
    preset: "berserk" | "default" | "python";
}

/**
 * Autonomously inspects a project root offline to detect framework, libraries,
 * UI file locations, design tokens, and appropriate presets.
 */
declare function detectProject(cwd?: string): ProjectInfo;

export { type AstroPluginOptions, type CategoryScore, type ColorsConfig, type ComponentReplacement, type ComponentsConfig, DesignSystemRuntimeError, type DoctorReport, type DseConfig, DseGuard, type DseGuardProps, type FixReport, type GeometryConfig, type RuleSeverity, type RulesConfig, type RuntimeViolation, type ScanResult, type TypographyConfig, type Violation, assertValidStyles, computeDoctorScore, defineConfig, detectProject, dseAstroPlugin, generateAgentInstructions, installPreCommitHook, loadConfig, runDseFix, runDseScan };
