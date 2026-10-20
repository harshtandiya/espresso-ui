import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dividerDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Divider",
};

describe("divider definition", () => {
  it("supports both orientations, alignment, flex stretching, and an action", () => {
    expect(dividerDef.name).toBe("divider");
    expect(dividerDef.props.orientation.values).toEqual(["horizontal", "vertical"]);
    expect(dividerDef.props.align.values).toEqual(["start", "center", "end"]);
    expect(dividerDef.registryDependencies).toEqual(["button"]);
  });
});

describe("divider templates", () => {
  it("renders a plain rule or a rule with an action in React", async () => {
    const result = await eta.renderAsync("./divider.react.eta", baseData);
    expect(result).toContain('role="separator"');
    expect(result).toContain("border-outline-gray-2");
    expect(result).toContain("relative z-10");
    expect(result).toContain('action.variant ?? "outline"');
  });

  it("renders a plain rule or a rule with an action in Vue", async () => {
    const result = await eta.renderAsync("./divider.vue.eta", baseData);
    expect(result).toContain('role="separator"');
    expect(result).toContain("actionContainerClasses");
    expect(result).toContain("onActionClick");
    expect(result).toContain("Button.vue");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./divider.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./divider.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./divider.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
