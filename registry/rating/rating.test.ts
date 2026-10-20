import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ratingDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Rating",
};

describe("rating definition", () => {
  it("supports whole and half stars, a custom max, and labeling", () => {
    expect(ratingDef.name).toBe("rating");
    expect(ratingDef.props.max.default).toBe(5);
    expect(ratingDef.props.step.values).toEqual([1, 0.5]);
    expect(ratingDef.props.size.values).toEqual(["xs", "sm", "md", "lg"]);
    expect(ratingDef.registryDependencies).toEqual(["label", "error-message"]);
  });
});

describe("rating styles", () => {
  it("clips each half-star at the midline", async () => {
    const css = await fs.readFile(path.join(__dirname, "rating.css"), "utf-8");
    expect(css).toContain("inset(0 50% 0 0)");
    expect(css).toContain("inset(0 0 0 50%)");
  });
});

describe("rating templates", () => {
  it("renders a radiogroup, per-star radios, and hover previews in React", async () => {
    const result = await eta.renderAsync("./rating.react.eta", baseData);
    expect(result).toContain('role={isSlider ? "slider" : "radiogroup"}');
    expect(result).toContain('role={isSlider ? undefined : "radio"}');
    expect(result).toContain("halfState");
    expect(result).toContain("aria-valuetext");
  });

  it("renders a radiogroup, per-star radios, and hover previews in Vue", async () => {
    const result = await eta.renderAsync("./rating.vue.eta", baseData);
    expect(result).toContain(":role=\"isSlider ? 'slider' : 'radiogroup'\"");
    expect(result).toContain("halfState");
    expect(result).toContain("aria-valuetext");
    expect(result).toContain("ErrorMessage.vue");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./rating.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./rating.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./rating.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
