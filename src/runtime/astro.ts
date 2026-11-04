import { assertValidStyles, DesignSystemRuntimeError } from "./core.js";

export interface AstroPluginOptions {
  strict?: boolean;
}

/**
 * Astro / Vite Runtime & Build Guard Plugin
 * Throws compile/runtime errors when Astro or SSR components introduce hardcoded colors or banned elements.
 */
export function dseAstroPlugin(options: AstroPluginOptions = {}) {
  return {
    name: "vite-plugin-dse-astro",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      if (!id.endsWith(".astro") && !id.endsWith(".jsx") && !id.endsWith(".tsx")) {
        return null;
      }

      // Check for hardcoded hex colors
      const hexMatch = code.match(/className=["'][^"']*?(#(?:[0-9a-fA-F]{3,8}))[^"']*?["']/);
      if (hexMatch) {
        throw new DesignSystemRuntimeError({
          techStack: "astro",
          rule: "no-hardcoded-colors",
          message: `In ${id}: Disallowed hardcoded hex color '${hexMatch[1]}' found in template. All colors must use tokens.`,
          receivedValue: hexMatch[1],
        });
      }

      // Check for raw HTML button in Astro template
      if (/<button\b[^>]*>/i.test(code) && !id.includes("components/ui/button")) {
        throw new DesignSystemRuntimeError({
          techStack: "astro",
          rule: "no-raw-html-elements",
          message: `In ${id}: Raw browser default '<button>' found. Use '<Button>' primitive from your design system.`,
          elementOrComponent: "button",
        });
      }

      return null;
    },
  };
}

