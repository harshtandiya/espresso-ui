import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dropdownMenuDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "DropdownMenu",
};

describe("dropdown menu definition", () => {
  it("renders rows, separators, and groups", () => {
    expect(dropdownMenuDef.name).toBe("dropdown-menu");
    expect(dropdownMenuDef.props.side.default).toBe("bottom");
    expect(dropdownMenuDef.props.align.default).toBe("start");
    expect(dropdownMenuDef.emits).toEqual(["select"]);
  });
});

describe("dropdown menu templates", () => {
  it("renders an Ark UI menu with items and separators in React", async () => {
    const result = await eta.renderAsync("./dropdown-menu.react.eta", baseData);
    expect(result).toContain("ArkMenu.Root");
    expect(result).toContain("ArkMenu.Trigger");
    expect(result).toContain("ArkMenu.Content");
    expect(result).toContain("ArkMenu.Item");
    expect(result).toContain("ArkMenu.Separator");
    expect(result).toContain("ArkMenu.ItemGroup");
  });

  it("renders an Ark UI menu with items and separators in Vue", async () => {
    const result = await eta.renderAsync("./dropdown-menu.vue.eta", baseData);
    expect(result).toContain("MenuRoot");
    expect(result).toContain("MenuTrigger");
    expect(result).toContain("MenuContent");
    expect(result).toContain("MenuItem");
    expect(result).toContain("MenuSeparator");
    expect(result).toContain("MenuItemGroup");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./dropdown-menu.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./dropdown-menu.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./dropdown-menu.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });
});
