import type { ScanResult } from "../config/types.js";

export interface CategoryScore {
  name: string;
  category: "typography" | "geometry" | "components" | "colors" | "wrapping" | "tables";
  violations: number;
  score: number; // 0 - 100
}

export interface DoctorReport {
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

export function computeDoctorScore(result: ScanResult): DoctorReport {
  const categoryViolations = {
    typography: 0,
    geometry: 0,
    components: 0,
    colors: 0,
    wrapping: 0,
    tables: 0,
  };

  const fileCountMap: Record<string, number> = {};

  result.violations.forEach((v) => {
    fileCountMap[v.file] = (fileCountMap[v.file] || 0) + 1;

    if (v.rule.startsWith("font-") || v.rule.includes("text-size") || v.rule.includes("uppercase")) {
      categoryViolations.typography++;
    } else if (v.rule.includes("wrapping")) {
      categoryViolations.wrapping++;
    } else if (v.rule.startsWith("control-") || v.rule.startsWith("corner-radius")) {
      categoryViolations.geometry++;
    } else if (v.rule.includes("color") || v.rule.includes("gradient") || v.rule.includes("blur")) {
      categoryViolations.colors++;
    } else if (v.rule.startsWith("table-")) {
      categoryViolations.tables++;
    } else {
      categoryViolations.components++;
    }
  });

  const filesCount = Math.max(1, result.scannedFilesCount || 1);

  function calcScore(violations: number): number {
    const penaltyPerViolation = 100 / (filesCount * 2);
    return Math.max(0, Math.round(100 - violations * penaltyPerViolation));
  }

  const categories: CategoryScore[] = [
    { name: "Typography Scale", category: "typography", violations: categoryViolations.typography, score: calcScore(categoryViolations.typography) },
    { name: "Geometry & Radii", category: "geometry", violations: categoryViolations.geometry, score: calcScore(categoryViolations.geometry) },
    { name: "Wrap Integrity", category: "wrapping", violations: categoryViolations.wrapping, score: calcScore(categoryViolations.wrapping) },
    { name: "Component Inventory", category: "components", violations: categoryViolations.components, score: calcScore(categoryViolations.components) },
    { name: "Color Purity", category: "colors", violations: categoryViolations.colors, score: calcScore(categoryViolations.colors) },
    { name: "Table Invariants", category: "tables", violations: categoryViolations.tables, score: calcScore(categoryViolations.tables) },
  ];

  const totalScore = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);

  let grade: DoctorReport["grade"] = "F";
  if (totalScore >= 98) grade = "A+";
  else if (totalScore >= 90) grade = "A";
  else if (totalScore >= 80) grade = "B";
  else if (totalScore >= 70) grade = "C";
  else if (totalScore >= 60) grade = "D";

  const fileBreakdown = Object.entries(fileCountMap)
    .map(([file, violations]) => ({ file, violations }))
    .sort((a, b) => b.violations - a.violations)
    .slice(0, 5);

  return {
    overallScore: totalScore,
    grade,
    scannedFiles: filesCount,
    totalViolations: result.violations.length,
    categories,
    fileBreakdown,
  };
}

