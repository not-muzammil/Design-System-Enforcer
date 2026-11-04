import React from "react";
import { assertValidStyles, DesignSystemRuntimeError } from "./core.js";

export interface DseGuardProps {
  children: React.ReactNode;
  strict?: boolean;
}

/**
 * React / Next.js Runtime Design System Enforcer Guard
 * Throws runtime errors in development if hardcoded colors, raw HTML,
 * or non-compliant design tokens are rendered.
 */
export const DseGuard: React.FC<DseGuardProps> = ({ children, strict = true }) => {
  if (process.env.NODE_ENV === "production" && !strict) {
    return <>{children}</>;
  }

  const inspectTree = (node: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(node)) return node;

    const props = node.props as Record<string, any>;
    const type = node.type;
    const tagName = typeof type === "string" ? type : type.name || "Component";

    // 1. Invariant: Ban raw HTML controls
    if (typeof type === "string") {
      const bannedHtml = ["button", "select", "textarea"];
      if (bannedHtml.includes(type.toLowerCase())) {
        throw new DesignSystemRuntimeError({
          techStack: "react",
          rule: "no-raw-html-elements",
          message: `Raw browser default '<${type}>' rendered at runtime. You must use canonical '<Button>', '<Dropdown>', or '<Textarea>' components.`,
          elementOrComponent: type,
        });
      }

      if (type.toLowerCase() === "input" && ["checkbox", "radio", "range", "color"].includes(props.type)) {
        throw new DesignSystemRuntimeError({
          techStack: "react",
          rule: "no-raw-html-elements",
          message: `Raw browser default '<input type="${props.type}">' rendered at runtime. Use standard design system '<Checkbox>' or '<Slider>'.`,
          elementOrComponent: `input[type=${props.type}]`,
        });
      }
    }

    // 2. Invariant: Check hardcoded colors in className and style
    assertValidStyles(props.className, tagName, "react");
    assertValidStyles(props.style, tagName, "react");

    if (props.children) {
      return React.cloneElement(node, {
        ...props,
        children: React.Children.map(props.children, inspectTree),
      } as any);
    }

    return node;
  };

  return <>{React.Children.map(children, inspectTree)}</>;
};


