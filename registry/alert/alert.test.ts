import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { alertDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Alert",
};

describe("alert definition", () => {
  it("covers the five status themes and both action slots", () => {
    expect(alertDef.name).toBe("alert");
    expect(alertDef.props.theme.values).toEqual(["gray", "blue", "green", "amber", "red"]);
    expect(alertDef.props.dismissible.default).toBe(false);
    expect(alertDef.registryDependencies).toEqual(["button"]);
    expect(alertDef.emits).toEqual(["dismiss"]);
  });
});

describe("alert templates", () => {
  it("chooses alert or status roles and renders row and banner layouts in React", async () => {
    const result = await eta.renderAsync("./alert.react.eta", baseData);
    expect(result).toContain("role={role}");
    expect(result).toContain('data-layout="row"');
    expect(result).toContain('data-layout="banner"');
    expect(result).toContain("runAction");
    expect(result).toContain("dismissible");
  });

  it("chooses alert or status roles and renders row and banner layouts in Vue", async () => {
    const result = await eta.renderAsync("./alert.vue.eta", baseData);
    expect(result).toContain(':role="role"');
    expect(result).toContain('data-layout="row"');
    expect(result).toContain('data-layout="banner"');
    expect(result).toContain("handleAction");
    expect(result).toContain("bannerPrimaryClass");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./alert.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./alert.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./alert.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
