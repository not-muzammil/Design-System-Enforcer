export const buttonTemplate = `import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", children, ...props }, ref) => {
    // Standard 36px height, 8px radius, font-medium, strictly neutral palette
    const baseClasses =
      "inline-flex items-center justify-center font-medium text-sm rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 select-none";

    const variantClasses = {
      primary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-2xs",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
      outline: "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 shadow-2xs",
      ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
    }[variant];

    const sizeClasses = {
      default: "h-[36px] min-h-[36px] px-3.5 gap-2",
      sm: "h-[30px] min-h-[30px] px-2.5 text-sm gap-1.5",
      icon: "size-9 min-h-[36px] min-w-[36px] p-0",
    }[size];

    return (
      <button ref={ref} className={\`\${baseClasses} \${variantClasses} \${sizeClasses} \${className}\`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
`;

export const chipTemplate = `import React from "react";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "neutral" | "success" | "warning" | "error" | "outline";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  variant = "neutral",
  icon,
  children,
  className = "",
  ...props
}) => {
  // Standard 36px height, 8px radius, 14px typography
  const baseClasses =
    "inline-flex items-center h-[36px] min-h-[36px] px-3 rounded-md text-sm font-medium gap-1.5 select-none";

  const variantClasses = {
    neutral: "bg-neutral-100 text-neutral-800 border border-neutral-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-red-50 text-red-700 border border-red-200",
    outline: "bg-white text-neutral-700 border border-neutral-200",
  }[variant];

  return (
    <div className={\`\${baseClasses} \${variantClasses} \${className}\`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
`;

export const inputTemplate = `import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, type = "text", ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && <div className="absolute left-3 text-neutral-400 pointer-events-none">{icon}</div>}
        <input
          ref={ref}
          type={type}
          className={\`w-full h-[36px] min-h-[36px] \${icon ? "pl-9" : "px-3"} pr-3 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors disabled:opacity-50 \${className}\`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
`;

export const dropdownTemplate = `import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={\`relative inline-block w-full min-w-[140px] \${className}\`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[36px] min-h-[36px] px-3 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 flex items-center justify-between gap-2 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50"
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-60 overflow-y-auto py-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                onChange?.(option.value);
                setIsOpen(false);
              }}
              className={\`w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-neutral-100 transition-colors \${option.value === value ? "bg-neutral-50 font-medium text-neutral-900" : "text-neutral-700"} \${option.disabled ? "opacity-50 cursor-not-allowed" : ""}\`}
            >
              {option.icon}
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
`;

export const tableTemplate = `import React from "react";

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div className="w-full rounded-md border border-neutral-200 bg-white shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table ref={ref} className={\`w-full text-sm text-left border-collapse \${className}\`} {...props}>
          {children}
        </table>
      </div>
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", children, ...props }, ref) => (
    <thead ref={ref} className={\`bg-neutral-50/80 border-b border-neutral-200 text-neutral-900 font-medium \${className}\`} {...props}>
      {children}
    </thead>
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", children, ...props }, ref) => (
    <tbody ref={ref} className={\`divide-none bg-white \${className}\`} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = "", children, ...props }, ref) => (
    <tr ref={ref} className={\`border-b border-neutral-200 transition-colors hover:bg-neutral-50/60 last:border-b-0 \${className}\`} {...props}>
      {children}
    </tr>
  )
);
TableRow.displayName = "TableRow";

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  icon?: React.ReactNode;
  resizable?: boolean;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className = "", icon, resizable = true, children, ...props }, ref) => (
    <th
      ref={ref}
      className={\`h-[36px] px-4 text-left font-medium text-sm text-neutral-900 select-none align-middle relative \${className}\`}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-neutral-500 shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
    </th>
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <td ref={ref} className={\`px-4 py-2.5 align-middle text-sm text-neutral-900 \${className}\`} {...props}>
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";
`;

export const tabsTemplate = `import React from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className = "" }) => {
  // Standard 36px height, 8px radius, font-medium
  return (
    <div className={\`inline-flex h-[36px] min-h-[36px] items-center rounded-md bg-neutral-100 p-1 text-neutral-600 \${className}\`}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={\`inline-flex h-[28px] items-center justify-center gap-1.5 rounded-sm px-3 text-sm font-medium transition-all select-none \${
              isActive
                ? "bg-white text-neutral-900 shadow-2xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50"
            } \${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}\`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                {tab.count}
              </span>
            )}
            {tab.badge}
          </button>
        );
      })}
    </div>
  );
};
`;

export const cardTemplate = `import React from "react";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    // Standard 12px corner radius (rounded-lg) for main content cards and containers
    <div
      ref={ref}
      className={\`rounded-lg border border-neutral-200 bg-white p-5 shadow-xs text-neutral-900 \${className}\`}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";
`;

export const checkboxTemplate = `import React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, id, ...props }, ref) => {
    return (
      <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          // Strictly 20px (size-5) and 4px radius (rounded-xs / rounded-[4px])
          className={\`size-5 rounded-xs border border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 transition-colors cursor-pointer \${className}\`}
          {...props}
        />
        {label && <span className="text-sm font-medium text-neutral-900">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
`;

export const skeletonTemplate = `import React from "react";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <div
      className={\`animate-pulse rounded-md bg-neutral-200/70 \${className}\`}
      {...props}
    />
  );
};
`;
