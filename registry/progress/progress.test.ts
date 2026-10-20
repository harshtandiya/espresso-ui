import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { progressDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Progress",
};

describe("progress definition", () => {
  it("exposes the four bar heights", () => {
    expect(progressDef.name).toBe("progress");
    expect(progressDef.props.size.values).toEqual(["sm", "md", "lg", "xl"]);
    expect(progressDef.props.value.required).toBe(true);
  });
});

describe("progress tokens", () => {
  it("uses the 2 / 4 / 8 / 12px scale and a composited transition", async () => {
    const css = await fs.readFile(path.join(__dirname, "progress.css"), "utf-8");
    expect(css).toContain("--progress-sm-height: 2px");
    expect(css).toContain("--progress-md-height: 4px");
    expect(css).toContain("--progress-lg-height: 8px");
    expect(css).toContain("--progress-xl-height: 12px");
    expect(css).toContain("--progress-transition-duration: 660ms");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("progress templates", () => {
  it("renders an accessible progressbar with intervals in React", async () => {
    const result = await eta.renderAsync("./progress.react.eta", baseData);
    expect(result).toContain('role="progressbar"');
    expect(result).toContain("aria-valuenow={clamped}");
    expect(result).toContain("filledIntervals");
    expect(result).toContain("motion-reduce:transition-none");
  });

  it("renders an accessible progressbar with intervals in Vue", async () => {
    const result = await eta.renderAsync("./progress.vue.eta", baseData);
    expect(result).toContain('role="progressbar"');
    expect(result).toContain(':aria-valuenow="clamped"');
    expect(result).toContain("filledIntervals");
    expect(result).toContain("motion-reduce:transition-none");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./progress.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./progress.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./progress.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
