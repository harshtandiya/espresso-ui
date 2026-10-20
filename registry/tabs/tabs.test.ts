import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tabsDef } from "./definition.js";
import { tabListDef } from "../tab-list/definition.js";
import { tabPanelDef } from "../tab-panel/definition.js";
import { tabTriggerDef } from "../tab-trigger/definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const etaList = new Eta({ views: path.join(__dirname, "..", "tab-list") });
const etaTrigger = new Eta({ views: path.join(__dirname, "..", "tab-trigger") });
const etaPanel = new Eta({ views: path.join(__dirname, "..", "tab-panel") });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Tabs",
};

describe("tabs definition", () => {
  it("exposes four variants, two sizes, and vertical orientation", () => {
    expect(tabsDef.name).toBe("tabs");
    expect(tabsDef.props.variant.values).toEqual(["underline", "subtle", "ghost", "browser-tab"]);
    expect(tabsDef.props.size.values).toEqual(["sm", "md"]);
    expect(tabsDef.props.vertical.default).toBe(false);
  });

  it("wires the compound parts through registry dependencies", () => {
    expect(tabListDef.registryDependencies).toEqual(["tabs"]);
    expect(tabTriggerDef.registryDependencies).toEqual(["tabs", "tab-list"]);
    expect(tabPanelDef.registryDependencies).toEqual(["tabs"]);
  });
});

describe("tabs templates", () => {
  it("renders accessible compound parts and roving focus in React", async () => {
    const result = await eta.renderAsync("./tabs.react.eta", baseData);
    expect(result).toContain('role="tablist"');
    expect(result).toContain('role="tab"');
    expect(result).toContain('role="tabpanel"');
    expect(result).toContain("ArrowRight");
    expect(result).toContain("browser-tab");
    expect(result).toContain("aria-selected");
  });

  it("renders the root, list, trigger, and panel in Vue", async () => {
    const list = await etaList.renderAsync("./tab-list.vue.eta", {
      ...baseData,
      componentName: "TabList",
    });
    const trigger = await etaTrigger.renderAsync("./tab-trigger.vue.eta", {
      ...baseData,
      componentName: "TabTrigger",
    });
    const panel = await etaPanel.renderAsync("./tab-panel.vue.eta", {
      ...baseData,
      componentName: "TabPanel",
    });
    expect(list).toContain('role="tablist"');
    expect(trigger).toContain('role="tab"');
    expect(panel).toContain('role="tabpanel"');
    expect(trigger).toContain("aria-selected");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./tabs.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./tabs.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue root template", async () => {
    const result = await eta.renderAsync("./tabs.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue list template", async () => {
    const result = await etaList.renderAsync("./tab-list.vue.eta", {
      ...baseData,
      componentName: "TabList",
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue trigger template", async () => {
    const result = await etaTrigger.renderAsync("./tab-trigger.vue.eta", {
      ...baseData,
      componentName: "TabTrigger",
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue panel template", async () => {
    const result = await etaPanel.renderAsync("./tab-panel.vue.eta", {
      ...baseData,
      componentName: "TabPanel",
    });
    expect(result).toMatchSnapshot();
  });
});
