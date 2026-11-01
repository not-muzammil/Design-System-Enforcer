import { describe, it, expect } from "vitest";
import { runPythonRules } from "../src/rules/python-rules.js";
import { pythonPreset } from "../src/config/presets/python.js";

describe("Python & Template Rules", () => {
  it("does not flag Python return type hints as text arrows", () => {
    const code = `
def get_embedding_model() -> Model:
    return load_model()
`;
    const violations: any[] = [];
    runPythonRules(
      code,
      "app.py",
      (file, line, col, rule, message, snippet) => {
        violations.push({ rule, message });
      },
      pythonPreset
    );

    expect(violations.filter((v) => v.rule === "no-text-arrows").length).toBe(0);
  });

  it("flags raw text arrows in UI strings", () => {
    const code = `
st.button("Proceed to next stage ->")
`;
    const violations: any[] = [];
    runPythonRules(
      code,
      "app.py",
      (file, line, col, rule, message, snippet) => {
        violations.push({ rule, message });
      },
      pythonPreset
    );

    expect(violations.some((v) => v.rule === "no-text-arrows")).toBe(true);
  });

  it("flags font sizes smaller than 14px in embedded Python CSS", () => {
    const code = `
st.markdown("""
<style>
    .custom-label { font-size: 11px; }
</style>
""", unsafe_allow_html=True)
`;
    const violations: any[] = [];
    runPythonRules(
      code,
      "app.py",
      (file, line, col, rule, message, snippet) => {
        violations.push({ rule, message });
      },
      pythonPreset
    );

    expect(violations.some((v) => v.rule === "font-size-min")).toBe(true);
  });

  it("flags font weight exceeding 500 in embedded Python CSS", () => {
    const code = `
st.markdown("""
<style>
    button { font-weight: 700 !important; }
</style>
""", unsafe_allow_html=True)
`;
    const violations: any[] = [];
    runPythonRules(
      code,
      "app.py",
      (file, line, col, rule, message, snippet) => {
        violations.push({ rule, message });
      },
      pythonPreset
    );

    expect(violations.some((v) => v.rule === "font-weight-max")).toBe(true);
  });
});
