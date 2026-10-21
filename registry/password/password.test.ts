import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { passwordDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Password",
};

describe("password definition", () => {
  it("builds on the text input, tooltip, and keyboard shortcut", () => {
    expect(passwordDef.name).toBe("password");
    expect(passwordDef.props.defaultVisible.default).toBe(false);
    expect(passwordDef.props.showEye.default).toBe(true);
    expect(passwordDef.registryDependencies).toEqual([
      "text-input",
      "tooltip",
      "keyboard-shortcut",
    ]);
  });
});

describe("password templates", () => {
  it("reveals the value on click and on the shortcut in React", async () => {
    const result = await eta.renderAsync("./password.react.eta", baseData);
    expect(result).toContain("TextInput");
    expect(result).toContain('type={visible ? "text" : "password"}');
    expect(result).toContain("KeyboardShortcut");
    expect(result).toContain("event.metaKey || event.ctrlKey");
  });

  it("reveals the value on click and on the shortcut in Vue", async () => {
    const result = await eta.renderAsync("./password.vue.eta", baseData);
    expect(result).toContain("TextInput");
    expect(result).toContain(":type=\"visible ? 'text' : 'password'\"");
    expect(result).toContain("KeyboardShortcut");
    expect(result).toContain("event.metaKey || event.ctrlKey");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./password.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./password.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./password.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });
});
