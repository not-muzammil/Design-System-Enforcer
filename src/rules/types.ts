import type { Violation, DseConfig } from "../config/types.js";

export type AddViolationFn = (
  file: string,
  line: number,
  col: number,
  rule: string,
  message: string,
  snippet?: string
) => void;

export interface RuleContext {
  filePath: string;
  content: string;
  lines: string[];
  config: DseConfig;
  addViolation: AddViolationFn;
}
