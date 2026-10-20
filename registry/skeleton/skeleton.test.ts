import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { skeletonDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Skeleton",
};

describe("skeleton definition", () => {
  it("is intentionally prop-free", () => {
    expect(skeletonDef.name).toBe("skeleton");
    expect(skeletonDef.props).toEqual({});
  });
});

describe("skeleton templates", () => {
  it("is hidden from assistive tech and pulses in React", async () => {
    const result = await eta.renderAsync("./skeleton.react.eta", baseData);
    expect(result).toContain('aria-hidden="true"');
    expect(result).toContain("animate-pulse");
    expect(result).toContain("bg-surface-gray-3");
  });

  it("is hidden from assistive tech and pulses in Vue", async () => {
    const result = await eta.renderAsync("./skeleton.vue.eta", baseData);
    expect(result).toContain('aria-hidden="true"');
    expect(result).toContain("animate-pulse");
    expect(result).toContain("bg-surface-gray-3");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./skeleton.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./skeleton.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./skeleton.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
