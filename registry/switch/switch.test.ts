import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { switchDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Switch",
};

describe("switch definition", () => {
  it("exposes the frappe-ui v1 toggle sizes", () => {
    expect(switchDef.name).toBe("switch");
    expect(switchDef.props.size.values).toEqual(["xs", "sm", "md"]);
    expect(switchDef.props.controlPosition.values).toEqual(["start", "end"]);
  });
});

describe("switch css tokens", () => {
  it("defines the track and thumb geometry", async () => {
    const css = await fs.readFile(path.join(__dirname, "switch.css"), "utf-8");
    expect(css).toContain("--switch-xs-height: 14px");
    expect(css).toContain("--switch-sm-height: 16px");
    expect(css).toContain("--switch-md-height: 20px");
    expect(css).toContain("--switch-sm-width: 26px");
    expect(css).toContain("--switch-md-travel: 12px");
    expect(css).toContain("--switch-padded-radius: var(--radius-4)");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("switch templates", () => {
  it("renders a role=switch button in React", async () => {
    const result = await eta.renderAsync("./switch.react.eta", baseData);
    expect(result).toContain('role="switch"');
    expect(result).toContain("aria-checked={isChecked}");
    expect(result).toContain("onCheckedChange?: (checked: boolean) => void");
    expect(result).toContain('controlPosition?: "start" | "end"');
    expect(result).toContain("padded?: boolean");
  });

  it("renders a role=switch button in Vue", async () => {
    const result = await eta.renderAsync("./switch.vue.eta", baseData);
    expect(result).toContain('role="switch"');
    expect(result).toContain("defineModel");
    expect(result).toContain("controlPosition");
    expect(result).toContain("slots.label");
    expect(result).toContain('<slot name="description">');
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./switch.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./switch.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./switch.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
