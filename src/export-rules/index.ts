import type { DseConfig } from "../config/types.js";

export function generateMarkdownRules(config: DseConfig): string {
  const minFont = config.tokens?.typography?.minFontSize || "14px";
  const maxFont = config.tokens?.typography?.maxFontSize || "32px";
  const maxWeight = config.tokens?.typography?.maxFontWeight ?? 500;
  const maxControlHeight = config.tokens?.geometry?.maxControlHeight || "36px";

  return `<!-- BEGIN:design-system-enforcer-rules -->
# Design System Rules & Constraints (Enforced by DSE)

## Typography & Font Sizing Rules
- **Primary Body Font**: Always use standard ${minFont} (\`text-sm\`) as the primary body font across all tables, lists, cards, form inputs, dialogs, and buttons.
- **Large Body Font**: Use 16px (\`text-base\`) for large body text and emphasized copy.
- **Maximum Heading Size**: Headings must never exceed ${maxFont} (\`text-2xl\`). Headings larger than ${maxFont} (\`text-3xl\`, \`text-4xl\`) are strictly prohibited.
- **Prohibition on Font Sizes Below ${minFont}**: Font sizes smaller than ${minFont} (e.g. \`text-xs\`, \`12px\`, \`10px\`) are strictly prohibited.
- **Font Weight Cap**: Standard text and interactive elements must not exceed Medium / ${maxWeight} (\`font-medium\`). \`font-semibold\` or \`font-bold\` are prohibited.
- **No Uppercase Text**: Disallow \`uppercase\` or \`capitalize\` CSS transforms. Use standard sentence or title case.

## UI Iconography & Symbols
- **No Raw Text Arrows**: Never use raw unicode or ASCII arrows (→, ←, ↑, ↓, =>, ->). Use design system icon components instead.
- **No Emojis in UI**: Do NOT use raw emojis in badges, chips, buttons, labels, or table headers.

## Component Design & Primitives
- **Button Component**: Always use \`<Button>\` from \`@/components/ui/button\`. Raw \`<button>\` HTML elements are strictly prohibited.
  - Height is strictly standard ${maxControlHeight} (\`h-[36px] min-h-[36px]\`) with 8px corner radius (\`rounded-md\`).
  - Font weight is strictly \`font-medium\`.
  - **No Chip-Colored Buttons**: Buttons must NEVER use semantic chip colors (\`bg-emerald-*\`, \`bg-red-*\`, \`variant="danger"\`, \`variant="success"\`).
- **Chip Component**: \`<Chip>\` from \`@/components/ui/chip\` is the single source of truth for all tags, statuses, pills, and badges. Height is strictly standard ${maxControlHeight} with 8px radius.
  - **No Pseudo-Chips**: Never use raw \`<span>\` or \`<div>\` elements styled with fills and rounded corners to imitate chips.
- **Input Component**: Always use \`<Input>\` from \`@/components/ui/input\`. Raw \`<input type="text">\` is strictly prohibited.
- **Dropdown Component**: Always use \`<Dropdown>\` from \`@/components/ui/dropdown\` instead of raw \`<select>\`.
- **Checkbox Component**: Strictly 20px dimension (\`size-5\`) and 4px corner radius (\`rounded-xs\`). 4px radius is strictly reserved for checkboxes only.
- **Cards & Containers**: Main content cards must strictly use 12px corner radius (\`rounded-lg\`).

## Table Component Rules
- **Mandatory Table Suite**: Always use \`<Table>\`, \`<TableHeader>\`, \`<TableHead>\`, \`<TableBody>\`, \`<TableRow>\`, and \`<TableCell>\` from \`@/components/ui/table\`. Raw HTML table elements (\`<table>\`, \`<tr>\`, \`<td>\`) are strictly prohibited.
- **Mandatory TableHead Icons**: Every column header (\`<TableHead>\`) must provide an icon component via the \`icon\` prop (\`icon={<MailIcon size={20} />}\`). Only dedicated row selection checkbox columns are exempt.
- **Mandatory Resizable Columns**: All data columns must support column resizing. Explicitly setting \`resizable={false}\` on data columns is strictly prohibited.
- **Single Borders**: Never wrap \`<Table>\` in redundant outer bordered containers. Never apply \`divide-y\` to \`<TableBody>\`.
- **Uniform Table Typography**: All fonts across all cells and headers must share standard 14px size and uniform color (\`text-text-primary\`).
- **No Vertical Stacking**: Never vertically stack subtext or metadata inside \`<TableCell>\`. Every piece of metadata must reside in its own dedicated, resizable column.
- **Windowed Pagination**: Data tables rendering dynamic collections must implement pagination (Previous/Next buttons, page size selector [25, 50, 100], and 'Showing X to Y of Z' range indicator).

## Modals & Overlays
- **No Backdrop Blur**: \`backdrop-blur-*\` is strictly prohibited. Modal backdrops must use standard neutral grey overlay (\`bg-neutral-100/80\`) without blur.
<!-- END:design-system-enforcer-rules -->
`;
}
