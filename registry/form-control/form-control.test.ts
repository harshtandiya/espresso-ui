import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formControlDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "FormControl",
};

describe("form-control definition", () => {
  it("dispatches to every control we support", () => {
    expect(formControlDef.name).toBe("form-control");
    expect(formControlDef.props.type.values).toContain("textarea");
    expect(formControlDef.props.type.values).toContain("select");
    expect(formControlDef.props.type.values).toContain("checkbox");
  });

  it("declares the child registry dependencies", () => {
    expect(formControlDef.registryDependencies).toEqual([
      "text-input",
      "textarea",
      "select",
      "checkbox",
    ]);
  });
});

describe("form-control templates", () => {
  it("imports and dispatches to the child controls in React", async () => {
    const result = await eta.renderAsync("./form-control.react.eta", baseData);
    expect(result).toContain('import { TextInput } from "./TextInput"');
    expect(result).toContain('import { Textarea } from "./Textarea"');
    expect(result).toContain('import { Select } from "./Select"');
    expect(result).toContain('import { Checkbox } from "./Checkbox"');
    expect(result).toContain('type === "textarea"');
    expect(result).toContain('size === "lg" ? "md" : size');
  });

  it("forwards model, attrs, and slots in Vue", async () => {
    const result = await eta.renderAsync("./form-control.vue.eta", baseData);
    expect(result).toContain('import TextInput from "./TextInput.vue"');
    expect(result).toContain("forwardedAttrs");
    expect(result).toContain("update:modelValue");
    expect(result).toContain("$slots");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./form-control.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./form-control.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./form-control.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
