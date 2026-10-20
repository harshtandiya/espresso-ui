import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sliderDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Slider",
};

describe("slider definition", () => {
  it("defaults to a 0-100 range with a step of 1", () => {
    expect(sliderDef.name).toBe("slider");
    expect(sliderDef.props.min.default).toBe(0);
    expect(sliderDef.props.max.default).toBe(100);
    expect(sliderDef.props.step.default).toBe(1);
    expect(sliderDef.props.size.values).toEqual(["sm", "md"]);
  });

  it("depends on the shared label and error message components", () => {
    expect(sliderDef.registryDependencies).toEqual(["label", "error-message"]);
    expect(sliderDef.emits).toEqual(["update:modelValue", "value-commit"]);
  });
});

describe("slider templates", () => {
  it("renders an Ark UI slider with a track, range, and handle in React", async () => {
    const result = await eta.renderAsync("./slider.react.eta", baseData);
    expect(result).toContain("ArkSlider.Root");
    expect(result).toContain("ArkSlider.Track");
    expect(result).toContain("ArkSlider.Range");
    expect(result).toContain("ArkSlider.Thumb");
    expect(result).toContain("ArkSlider.HiddenInput");
    expect(result).toContain('origin={min < 0 && max > 0 ? "center" : "start"}');
  });

  it("renders an Ark UI slider with a track, range, and handle in Vue", async () => {
    const result = await eta.renderAsync("./slider.vue.eta", baseData);
    expect(result).toContain("SliderRoot");
    expect(result).toContain("SliderTrack");
    expect(result).toContain("SliderRange");
    expect(result).toContain("SliderThumb");
    expect(result).toContain("SliderHiddenInput");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./slider.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./slider.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./slider.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });
});
