export const cssTemplate = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* -------------------------------------------------------------------------
     * Design System Color Tokens (HSL)
     * Tip for AI Agents: Modify HSL values here to rebrand or customize themes!
     * ------------------------------------------------------------------------- */
    --background: 0 0% 100%;             /* White (#ffffff) */
    --foreground: 0 0% 11%;              /* Text Primary (#1c1c1c) */

    --muted: 0 0% 96%;                   /* Neutral 100 (#f5f5f5) */
    --muted-foreground: 0 0% 45%;        /* Text Secondary (#737373) */

    --border: 0 0% 90%;                  /* Stroke Default (#e5e5e5) */
    --input: 0 0% 90%;                   /* Input Stroke */

    --primary: 0 0% 9%;                  /* Brand Dark (#171717) */
    --primary-foreground: 0 0% 98%;

    --secondary: 0 0% 96%;
    --secondary-foreground: 0 0% 9%;

    --accent: 0 0% 96%;
    --accent-foreground: 0 0% 9%;

    /* Semantic Status Tokens */
    --success: 142 71% 45%;              /* Emerald */
    --success-foreground: 0 0% 100%;

    --warning: 38 92% 50%;               /* Amber */
    --warning-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;            /* Red */
    --destructive-foreground: 0 0% 100%;

    /* Geometry Tokens */
    --radius-sm: 8px;
    --radius-md: 8px;                    /* Standard 8px for controls */
    --radius-lg: 12px;                   /* Standard 12px for cards */
    --control-height: 36px;              /* Standard 36px */
  }

  .dark {
    --background: 0 0% 9%;
    --foreground: 0 0% 98%;

    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 64%;

    --border: 0 0% 20%;
    --input: 0 0% 20%;

    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;

    --secondary: 0 0% 15%;
    --secondary-foreground: 0 0% 98%;

    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 98%;
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-size: 14px;
    line-height: 1.5;
  }
}
`;
