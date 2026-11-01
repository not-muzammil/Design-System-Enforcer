import type { ScanResult } from "../config/types.js";

export function formatJson(result: ScanResult): string {
  return JSON.stringify(result, null, 2);
}

