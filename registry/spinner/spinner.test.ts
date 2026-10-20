import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spinnerDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Spinner",
};

describe("spinner definition", () => {
  it("exposes the four Figma sizes and two themes", () => {
    expect(spinnerDef.name).toBe("spinner");
    expect(spinnerDef.props.size.values).toEqual(["xs", "sm", "md", "lg"]);
    expect(spinnerDef.props.theme.values).toEqual(["gray", "red"]);
  });
});

describe("spinner styles", () => {
  it("draws a masked conic ring and respects reduced motion", async () => {
    const css = await fs.readFile(path.join(__dirname, "spinner.css"), "utf-8");
    expect(css).toContain("@property --spinner-angle");
    expect(css).toContain("conic-gradient");
    expect(css).toContain("mask:");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("espresso-spinner--track");
  });
});

describe("spinner templates", () => {
  it("maps size, theme, and track in React", async () => {
    const result = await eta.renderAsync("./spinner.react.eta", baseData);
    expect(result).toContain('role="status"');
    expect(result).toContain("sizeMap");
    expect(result).toContain("--spinner-thickness");
    expect(result).toContain("espresso-spinner--track");
  });

  it("maps size, theme, and track in Vue", async () => {
    const result = await eta.renderAsync("./spinner.vue.eta", baseData);
    expect(result).toContain('role="status"');
    expect(result).toContain("sizeMap");
    expect(result).toContain("--spinner-thickness");
    expect(result).toContain("espresso-spinner--track");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./spinner.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./spinner.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./spinner.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
