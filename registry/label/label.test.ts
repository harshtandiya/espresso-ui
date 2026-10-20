import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Label",
};

describe("label templates", () => {
  it("supports label and required marker like frappe-ui FormLabel", async () => {
    const react = await eta.renderAsync("./label.react.eta", baseData);
    const vue = await eta.renderAsync("./label.vue.eta", baseData);
    expect(react).toContain("label?: ReactNode");
    expect(react).toContain("required?: boolean");
    expect(react).toContain("(required)");
    expect(react).toContain("--label-required-color");
    expect(vue).toContain("label?: string");
    expect(vue).toContain("required?: boolean");
    expect(vue).toContain("(required)");
    expect(vue).toContain("--label-required-color");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./label.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./label.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./label.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
