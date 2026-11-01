import ts from "typescript";

export interface NodePosition {
  line: number;
  col: number;
}

export interface ExtractedClass {
  text: string;
  node: ts.Node;
}

export interface AttributeInfo {
  node: ts.JsxAttribute | ts.JsxSpreadAttribute;
  initializer?: ts.Expression | null;
  rawText: string;
  isSpread?: boolean;
}

/**
 * Parses file content into a TypeScript SourceFile AST.
 */
export function parseTsx(filePath: string, content: string): ts.SourceFile {
  const isTsx = filePath.endsWith(".tsx") || filePath.endsWith(".jsx");
  const kind = isTsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true, // setParentNodes = true for parent traversal
    kind
  );
}

/**
 * Gets 1-indexed line and column for any AST node.
 */
export function getNodePosition(sourceFile: ts.SourceFile, node: ts.Node): NodePosition {
  const start = node.getStart(sourceFile);
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(start);
  return { line: line + 1, col: character + 1 };
}

/**
 * Gets the clean tag name of a JSX element or self-closing element.
 */
export function getJsxTagName(node: ts.Node, sourceFile: ts.SourceFile): string | null {
  if (ts.isJsxElement(node)) {
    return node.openingElement.tagName.getText(sourceFile);
  }
  if (ts.isJsxSelfClosingElement(node)) {
    return node.tagName.getText(sourceFile);
  }
  if (ts.isJsxOpeningElement(node)) {
    return node.tagName.getText(sourceFile);
  }
  return null;
}

/**
 * Gets JSX attributes as a structured map.
 */
export function getJsxAttributes(node: ts.Node, sourceFile: ts.SourceFile): Record<string, AttributeInfo> {
  const attributes: Record<string, AttributeInfo> = {};
  const propContainer = ts.isJsxElement(node)
    ? node.openingElement.attributes
    : ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)
    ? node.attributes
    : null;

  if (!propContainer) return attributes;

  propContainer.properties.forEach((prop) => {
    if (ts.isJsxAttribute(prop)) {
      const name = prop.name.getText(sourceFile);
      attributes[name] = {
        node: prop,
        initializer: prop.initializer || null,
        rawText: prop.getText(sourceFile),
      };
    } else if (ts.isJsxSpreadAttribute(prop)) {
      attributes[`__spread_${prop.getStart(sourceFile)}`] = {
        node: prop,
        isSpread: true,
        rawText: prop.getText(sourceFile),
      };
    }
  });

  return attributes;
}

/**
 * Recursively extracts all class strings from a JSX attribute initializer.
 */
export function extractClassNames(initializer: ts.Expression | null | undefined, sourceFile: ts.SourceFile): ExtractedClass[] {
  const result: ExtractedClass[] = [];
  if (!initializer) return result;

  function collectStrings(node: ts.Node | undefined) {
    if (!node) return;

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      result.push({ text: node.text, node });
      return;
    }

    if (ts.isTemplateExpression(node)) {
      if (node.head.text) {
        result.push({ text: node.head.text, node: node.head });
      }
      for (const span of node.templateSpans) {
        collectStrings(span.expression);
        if (span.literal.text) {
          result.push({ text: span.literal.text, node: span.literal });
        }
      }
      return;
    }

    if (ts.isJsxExpression(node)) {
      collectStrings(node.expression);
      return;
    }

    if (ts.isParenthesizedExpression(node)) {
      collectStrings(node.expression);
      return;
    }

    if (ts.isBinaryExpression(node)) {
      collectStrings(node.left);
      collectStrings(node.right);
      return;
    }

    if (ts.isConditionalExpression(node)) {
      collectStrings(node.whenTrue);
      collectStrings(node.whenFalse);
      return;
    }

    if (ts.isArrayLiteralExpression(node)) {
      for (const element of node.elements) {
        collectStrings(element);
      }
      return;
    }

    if (ts.isCallExpression(node)) {
      for (const arg of node.arguments) {
        collectStrings(arg);
      }
      return;
    }

    if (ts.isObjectLiteralExpression(node)) {
      for (const prop of node.properties) {
        if (ts.isPropertyAssignment(prop)) {
          if (ts.isStringLiteral(prop.name) || ts.isIdentifier(prop.name)) {
            result.push({ text: prop.name.text, node: prop.name });
          }
        }
      }
      return;
    }
  }

  collectStrings(initializer);
  return result;
}

/**
 * Gets all imports in a SourceFile mapped by imported identifier to module specifier.
 */
export function getFileImports(sourceFile: ts.SourceFile): Record<string, string> {
  const imports: Record<string, string> = {};

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node) && node.importClause) {
      const moduleSpecifier = ts.isStringLiteral(node.moduleSpecifier)
        ? node.moduleSpecifier.text
        : "";

      if (node.importClause.name) {
        imports[node.importClause.name.text] = moduleSpecifier;
      }

      if (node.importClause.namedBindings) {
        if (ts.isNamedImports(node.importClause.namedBindings)) {
          node.importClause.namedBindings.elements.forEach((spec) => {
            const localName = spec.name.text;
            imports[localName] = moduleSpecifier;
          });
        } else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
          imports[node.importClause.namedBindings.name.text] = moduleSpecifier;
        }
      }
    }
  });

  return imports;
}

