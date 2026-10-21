import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dialogDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Dialog",
};

describe("dialog definition", () => {
  it("exposes sizes, themes, and the chrome switches", () => {
    expect(dialogDef.name).toBe("dialog");
    expect(dialogDef.props.size.default).toBe("lg");
    expect(dialogDef.props.dismissible.default).toBe(true);
    expect(dialogDef.props.showCloseButton.default).toBe(true);
    expect(dialogDef.props.bare.default).toBe(false);
    expect(dialogDef.props.position.values).toEqual(["center", "top"]);
  });

  it("renders its footer buttons with the shared button", () => {
    expect(dialogDef.registryDependencies).toEqual(["button"]);
    expect(dialogDef.emits).toEqual(["update:open", "update:modelValue", "close"]);
  });
});

describe("dialog templates", () => {
  it("renders an Ark UI dialog with a scrim, header and actions in React", async () => {
    const result = await eta.renderAsync("./dialog.react.eta", baseData);
    expect(result).toContain("ArkDialog.Root");
    expect(result).toContain("ArkDialog.Backdrop");
    expect(result).toContain("ArkDialog.Content");
    expect(result).toContain("ArkDialog.Title");
    expect(result).toContain("ArkDialog.Description");
    expect(result).toContain("bg-black-overlay-200");
  });

  it("renders an Ark UI dialog with a scrim, header and actions in Vue", async () => {
    const result = await eta.renderAsync("./dialog.vue.eta", baseData);
    expect(result).toContain("DialogRoot");
    expect(result).toContain("DialogBackdrop");
    expect(result).toContain("DialogContent");
    expect(result).toContain("DialogTitle");
    expect(result).toContain("bg-black-overlay-200");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./dialog.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./dialog.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./dialog.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });
});
