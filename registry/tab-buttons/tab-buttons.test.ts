import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tabButtonsDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "TabButtons",
};

describe("tab buttons definition", () => {
  it("shares the tabs variants and sizes", () => {
    expect(tabButtonsDef.name).toBe("tab-buttons");
    expect(tabButtonsDef.props.variant.values).toEqual([
      "subtle",
      "ghost",
      "underline",
      "browser-tab",
    ]);
    expect(tabButtonsDef.props.size.values).toEqual(["sm", "md"]);
    expect(tabButtonsDef.props.fluid.default).toBe(false);
  });
});

describe("tab buttons templates", () => {
  it("renders a radiogroup with a sliding indicator in React", async () => {
    const result = await eta.renderAsync("./tab-buttons.react.eta", baseData);
    expect(result).toContain('role="radiogroup"');
    expect(result).toContain('role: "radio"');
    expect(result).toContain('data-slot="tab-indicator"');
    expect(result).toContain("ArrowRight");
    expect(result).toContain("duration-200");
  });

  it("renders a radiogroup with a sliding indicator in Vue", async () => {
    const result = await eta.renderAsync("./tab-buttons.vue.eta", baseData);
    expect(result).toContain('role="radiogroup"');
    expect(result).toContain('role="radio"');
    expect(result).toContain('data-slot="tab-indicator"');
    expect(result).toContain("ArrowRight");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./tab-buttons.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./tab-buttons.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./tab-buttons.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });
});
