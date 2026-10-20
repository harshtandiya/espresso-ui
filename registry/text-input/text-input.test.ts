import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { textInputDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "TextInput",
};

describe("text-input definition", () => {
  it("exposes the frappe-ui v1 input scales", () => {
    expect(textInputDef.name).toBe("text-input");
    expect(textInputDef.props.size.values).toEqual(["xs", "sm", "md", "lg"]);
    expect(textInputDef.props.variant.values).toEqual(["subtle", "outline", "ghost"]);
  });

  it("declares prefix and suffix slots", () => {
    expect(textInputDef.slots).toContain("prefix");
    expect(textInputDef.slots).toContain("suffix");
  });
});

describe("text-input css tokens", () => {
  it("defines the 24 / 28 / 32 / 40px control heights", async () => {
    const css = await fs.readFile(path.join(__dirname, "text-input.css"), "utf-8");
    expect(css).toContain("--input-xs-height: 24px");
    expect(css).toContain("--input-sm-height: 28px");
    expect(css).toContain("--input-md-height: 32px");
    expect(css).toContain("--input-lg-height: 40px");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("text-input templates", () => {
  it("exposes label, description, error, prefix, and suffix in React", async () => {
    const result = await eta.renderAsync("./text-input.react.eta", baseData);
    expect(result).toContain("label?: ReactNode");
    expect(result).toContain("description?: ReactNode");
    expect(result).toContain("error?: ReactNode");
    expect(result).toContain("prefix?: ReactNode");
    expect(result).toContain("suffix?: ReactNode");
    expect(result).toContain("aria-invalid");
    expect(result).toContain("aria-describedby");
    expect(result).toContain("aria-errormessage");
    expect(result).toContain("(required)");
  });

  it("exposes label, description, error, prefix, and suffix in Vue", async () => {
    const result = await eta.renderAsync("./text-input.vue.eta", baseData);
    expect(result).toContain("label?: string");
    expect(result).toContain("description?: string");
    expect(result).toContain("error?: string");
    expect(result).toContain("useSlots");
    expect(result).toContain("slots.prefix");
    expect(result).toContain("slots.suffix");
    expect(result).toContain("aria-invalid");
    expect(result).toContain("aria-describedby");
    expect(result).toContain("(required)");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./text-input.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./text-input.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./text-input.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
