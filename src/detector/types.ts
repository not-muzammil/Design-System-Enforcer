export type Framework =
  | "nextjs"
  | "vite"
  | "react-cra"
  | "remix"
  | "astro"
  | "streamlit"
  | "python-general"
  | "unknown";

export type ComponentLibrary =
  | "shadcn"
  | "radix"
  | "tailwind"
  | "mui"
  | "chakra"
  | "lucide"
  | "none";

export interface ProjectInfo {
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

