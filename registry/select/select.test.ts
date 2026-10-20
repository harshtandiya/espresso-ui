import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { selectDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Select",
};

describe("select definition", () => {
  it("exposes the frappe-ui v1 input scales", () => {
    expect(selectDef.name).toBe("select");
    expect(selectDef.props.size.values).toEqual(["xs", "sm", "md", "lg"]);
    expect(selectDef.props.variant.values).toEqual(["subtle", "outline", "ghost"]);
  });

  it("declares label, description, prefix, and suffix slots", () => {
    expect(selectDef.slots).toEqual(["label", "description", "prefix", "suffix"]);
  });
});

describe("select tokens", () => {
  it("reuses the 24 / 28 / 32 / 40px control geometry", async () => {
    const css = await fs.readFile(path.join(__dirname, "select.css"), "utf-8");
    expect(css).toContain("--input-xs-height: 24px");
    expect(css).toContain("--input-sm-height: 28px");
    expect(css).toContain("--input-md-height: 32px");
    expect(css).toContain("--input-lg-height: 40px");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("select templates", () => {
  it("renders a native select with normalized options in React", async () => {
    const result = await eta.renderAsync("./select.react.eta", baseData);
    expect(result).toContain("ChevronDown");
    expect(result).toContain("normalizedOptions");
    expect(result).toContain("onValueChange");
    expect(result).toContain("aria-invalid={hasError || undefined}");
    expect(result).toContain('placeholder = "Select option"');
  });

  it("renders a native select with slots in Vue", async () => {
    const result = await eta.renderAsync("./select.vue.eta", baseData);
    expect(result).toContain("defineModel");
    expect(result).toContain("ChevronDown");
    expect(result).toContain('slot name="prefix"');
    expect(result).toContain('slot name="suffix"');
    expect(result).toContain(':aria-invalid="hasError || undefined"');
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./select.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./select.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./select.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
