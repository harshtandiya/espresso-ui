import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkboxDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Checkbox",
};

describe("checkbox definition", () => {
  it("exposes the frappe-ui v1 toggle sizes", () => {
    expect(checkboxDef.name).toBe("checkbox");
    expect(checkboxDef.props.size.values).toEqual(["xs", "sm", "md"]);
    expect(checkboxDef.props.padded.default).toBe(false);
    expect(checkboxDef.props.indeterminate.default).toBe(false);
  });
});

describe("checkbox css tokens", () => {
  it("defines the 13 / 14 / 16px control scale", async () => {
    const css = await fs.readFile(path.join(__dirname, "checkbox.css"), "utf-8");
    expect(css).toContain("--checkbox-xs-size: 13px");
    expect(css).toContain("--checkbox-sm-size: 14px");
    expect(css).toContain("--checkbox-md-size: 16px");
    expect(css).toContain("--checkbox-radius: var(--radius-1)");
    expect(css).toContain("--checkbox-padded-radius: var(--radius-4)");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("checkbox templates", () => {
  it("renders a native checkbox with an indeterminate state in React", async () => {
    const result = await eta.renderAsync("./checkbox.react.eta", baseData);
    expect(result).toContain('type="checkbox"');
    expect(result).toContain("indeterminate?: boolean");
    expect(result).toContain("aria-checked");
    expect(result).toContain("Minus");
    expect(result).toContain("Check");
    expect(result).toContain("padded?: boolean");
  });

  it("renders a native checkbox with label and description slots in Vue", async () => {
    const result = await eta.renderAsync("./checkbox.vue.eta", baseData);
    expect(result).toContain('type="checkbox"');
    expect(result).toContain("defineModel");
    expect(result).toContain("props.indeterminate");
    expect(result).toContain("slots.label");
    expect(result).toContain('<slot name="description">');
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./checkbox.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./checkbox.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./checkbox.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
