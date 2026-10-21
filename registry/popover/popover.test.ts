import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { popoverDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Popover",
};

describe("popover definition", () => {
  it("places the panel on a side and aligns it along that edge", () => {
    expect(popoverDef.name).toBe("popover");
    expect(popoverDef.props.side.default).toBe("bottom");
    expect(popoverDef.props.align.values).toEqual(["start", "center", "end"]);
    expect(popoverDef.props.offset.default).toBe(8);
  });

  it("closes on Escape and an outside click by default", () => {
    expect(popoverDef.props.dismissible.default).toBe(true);
    expect(popoverDef.props.autoFocus.default).toBe(true);
    expect(popoverDef.emits).toEqual(["update:modelValue", "open", "close"]);
  });
});

describe("popover templates", () => {
  it("renders an Ark UI popover with a trigger, panel and arrow in React", async () => {
    const result = await eta.renderAsync("./popover.react.eta", baseData);
    expect(result).toContain("ArkPopover.Root");
    expect(result).toContain("ArkPopover.Trigger");
    expect(result).toContain("ArkPopover.Positioner");
    expect(result).toContain("ArkPopover.Content");
    expect(result).toContain("ArkPopover.Arrow");
  });

  it("renders an Ark UI popover with a trigger, panel and arrow in Vue", async () => {
    const result = await eta.renderAsync("./popover.vue.eta", baseData);
    expect(result).toContain("PopoverRoot");
    expect(result).toContain("PopoverTrigger");
    expect(result).toContain("PopoverPositioner");
    expect(result).toContain("PopoverContent");
    expect(result).toContain("PopoverArrow");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./popover.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./popover.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./popover.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });
});
