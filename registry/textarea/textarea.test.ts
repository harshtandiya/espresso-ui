import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { textareaDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Textarea",
};

describe("textarea definition", () => {
  it("exposes the frappe-ui v1 input scales", () => {
    expect(textareaDef.name).toBe("textarea");
    expect(textareaDef.props.size.values).toEqual(["xs", "sm", "md", "lg"]);
    expect(textareaDef.props.variant.values).toEqual(["subtle", "outline", "ghost"]);
    expect(textareaDef.props.rows.default).toBe(3);
  });
});

describe("textarea css tokens", () => {
  it("defines the min heights and 13px text", async () => {
    const css = await fs.readFile(path.join(__dirname, "textarea.css"), "utf-8");
    expect(css).toContain("--textarea-xs-min-height: 32px");
    expect(css).toContain("--textarea-sm-min-height: 36px");
    expect(css).toContain("--textarea-md-min-height: 40px");
    expect(css).toContain("--textarea-lg-min-height: 44px");
    expect(css).toContain("--textarea-font-size: 13px");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("textarea templates", () => {
  it("exposes label, description, error, and rows in React", async () => {
    const result = await eta.renderAsync("./textarea.react.eta", baseData);
    expect(result).toContain("label?: ReactNode");
    expect(result).toContain("description?: ReactNode");
    expect(result).toContain("error?: ReactNode");
    expect(result).toContain("rows = 3");
    expect(result).toContain("aria-invalid");
    expect(result).toContain("aria-describedby");
    expect(result).toContain("(required)");
  });

  it("exposes label, description, error, and rows in Vue", async () => {
    const result = await eta.renderAsync("./textarea.vue.eta", baseData);
    expect(result).toContain("label?: string");
    expect(result).toContain("description?: string");
    expect(result).toContain("error?: string");
    expect(result).toContain("rows: 3");
    expect(result).toContain("aria-invalid");
    expect(result).toContain("aria-describedby");
    expect(result).toContain("(required)");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./textarea.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./textarea.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./textarea.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
