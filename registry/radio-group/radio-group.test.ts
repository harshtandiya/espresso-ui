import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { radioGroupDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "RadioGroup",
};

describe("radio-group definition", () => {
  it("exposes the frappe-ui v1 radio scale and orientations", () => {
    expect(radioGroupDef.name).toBe("radio-group");
    expect(radioGroupDef.props.size.values).toEqual(["xs", "sm", "md"]);
    expect(radioGroupDef.props.orientation.values).toEqual(["vertical", "horizontal"]);
  });

  it("declares the group label and description slots", () => {
    expect(radioGroupDef.slots).toEqual(["label", "description"]);
    expect(radioGroupDef.emits).toEqual(["update:modelValue"]);
  });
});

describe("radio tokens", () => {
  it("uses the 13 / 14 / 16px control geometry", async () => {
    const css = await fs.readFile(path.join(__dirname, "radio-group.css"), "utf-8");
    expect(css).toContain("--radio-xs-size: 13px");
    expect(css).toContain("--radio-sm-size: 14px");
    expect(css).toContain("--radio-md-size: 16px");
    expect(css).toContain("--radio-xs-checked-border: 3.7px");
    expect(css).toContain("--radio-sm-checked-border: 4px");
    expect(css).toContain("--radio-md-checked-border: 4.5px");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("radio-group templates", () => {
  it("renders a native radio group with a shared context in React", async () => {
    const result = await eta.renderAsync("./radio-group.react.eta", baseData);
    expect(result).toContain("createContext");
    expect(result).toContain('role="radiogroup"');
    expect(result).toContain("RadioGroupContext.Provider");
    expect(result).toContain("aria-errormessage");
    expect(result).toContain("data-loop");
  });

  it("provides the group context and error lines in Vue", async () => {
    const result = await eta.renderAsync("./radio-group.vue.eta", baseData);
    expect(result).toContain("RADIO_GROUP_KEY");
    expect(result).toContain("provide(RADIO_GROUP_KEY");
    expect(result).toContain('role="radiogroup"');
    expect(result).toContain("data-loop");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./radio-group.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./radio-group.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./radio-group.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
