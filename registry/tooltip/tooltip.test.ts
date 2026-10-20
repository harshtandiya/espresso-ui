import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tooltipDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Tooltip",
};

describe("tooltip definition", () => {
  it("exposes sides, delay, offset, bare, and disabled", () => {
    expect(tooltipDef.name).toBe("tooltip");
    expect(tooltipDef.props.side.values).toEqual(["top", "right", "bottom", "left"]);
    expect(tooltipDef.props.hoverDelay.default).toBe(500);
    expect(tooltipDef.props.disabled.default).toBe(false);
  });
});

describe("tooltip styles", () => {
  it("scales from the trigger and respects reduced motion", async () => {
    const css = await fs.readFile(path.join(__dirname, "tooltip.css"), "utf-8");
    expect(css).toContain("transform-origin: var(--transform-origin)");
    expect(css).toContain("125ms");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("--arrow-size: 8px");
  });
});

describe("tooltip templates", () => {
  it("wraps the trigger with Ark and portals the bubble in React", async () => {
    const result = await eta.renderAsync("./tooltip.react.eta", baseData);
    expect(result).toContain("ArkTooltip.Root");
    expect(result).toContain("openDelay={hoverDelay}");
    expect(result).toContain("<Portal>");
    expect(result).toContain('data-slot="bubble"');
    expect(result).toContain("disabled");
  });

  it("wraps the trigger with Ark and teleports the bubble in Vue", async () => {
    const result = await eta.renderAsync("./tooltip.vue.eta", baseData);
    expect(result).toContain("ArkTooltip.Root");
    expect(result).toContain(':open-delay="props.hoverDelay"');
    expect(result).toContain("<Teleport");
    expect(result).toContain('data-slot="bubble"');
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./tooltip.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./tooltip.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./tooltip.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
