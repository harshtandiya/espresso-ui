import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { keyboardShortcutDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "KeyboardShortcut",
};

describe("keyboard shortcut definition", () => {
  it("exposes a combo, chips, and alternatives", () => {
    expect(keyboardShortcutDef.name).toBe("keyboard-shortcut");
    expect(keyboardShortcutDef.props.bg.default).toBe(false);
    expect(keyboardShortcutDef.props.showPlus.default).toBe("auto");
    expect(keyboardShortcutDef.props.useIcons.default).toBe(true);
  });
});

describe("keyboard shortcut templates", () => {
  it("parses a combo and names the shortcut in React", async () => {
    const result = await eta.renderAsync("./keyboard-shortcut.react.eta", baseData);
    expect(result).toContain("parseCombo");
    expect(result).toContain("Shortcut ");
    expect(result).toContain('role={ariaLabel ? "img" : undefined}');
    expect(result).toContain('data-slot="key"');
  });

  it("parses a combo and names the shortcut in Vue", async () => {
    const result = await eta.renderAsync("./keyboard-shortcut.vue.eta", baseData);
    expect(result).toContain("parseCombo");
    expect(result).toContain("Shortcut ");
    expect(result).toContain('data-slot="key"');
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./keyboard-shortcut.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./keyboard-shortcut.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./keyboard-shortcut.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });
});
