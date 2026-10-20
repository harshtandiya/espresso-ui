import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { radioDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Radio",
};

describe("radio definition", () => {
  it("is an option inside a radio group", () => {
    expect(radioDef.name).toBe("radio");
    expect(radioDef.props.value.required).toBe(true);
    expect(radioDef.registryDependencies).toEqual(["radio-group"]);
  });

  it("declares label and description slots", () => {
    expect(radioDef.slots).toEqual(["label", "description"]);
  });
});

describe("radio templates", () => {
  it("renders a native radio input in React", async () => {
    const result = await eta.renderAsync("./radio.react.eta", baseData);
    expect(result).toContain("useContext(RadioGroupContext)");
    expect(result).toContain('type="radio"');
    expect(result).toContain('className="peer sr-only"');
    expect(result).toContain("group.onSelect(value)");
    expect(result).toContain("--radio-sm-checked-border");
  });

  it("renders a native radio input in Vue", async () => {
    const result = await eta.renderAsync("./radio.vue.eta", baseData);
    expect(result).toContain("inject(RADIO_GROUP_KEY");
    expect(result).toContain('type="radio"');
    expect(result).toContain("group.onSelect(props.value)");
    expect(result).toContain("--radio-sm-checked-border");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./radio.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./radio.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./radio.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
