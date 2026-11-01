import { describe, it, expect } from "vitest";
import { defineConfig, loadConfig } from "../src/config/loader.js";
import { berserkPreset } from "../src/config/presets/berserk.js";

describe("Config Loader", () => {
  it("defines and validates config structure", () => {
    const config = defineConfig({
      preset: "berserk",
      rules: {
        "no-text-arrows": "error",
      },
    });

    expect(config.preset).toBe("berserk");
    expect(config.rules?.["no-text-arrows"]).toBe("error");
  });

  it("loads default preset when no custom config exists", async () => {
    const loaded = await loadConfig("/non/existent/path");
    expect(loaded.preset).toBe(berserkPreset.preset);
    expect(loaded.rules?.["font-size-min"]).toBe("error");
  });
});
