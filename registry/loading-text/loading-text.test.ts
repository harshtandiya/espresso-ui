import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadingTextDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "LoadingText",
};

describe("loading text definition", () => {
  it("defaults to a loading message and reuses the spinner", () => {
    expect(loadingTextDef.name).toBe("loading-text");
    expect(loadingTextDef.props.text.default).toBe("Loading...");
    expect(loadingTextDef.registryDependencies).toEqual(["spinner"]);
  });
});

describe("loading text templates", () => {
  it("renders a spinner next to the text in React", async () => {
    const result = await eta.renderAsync("./loading-text.react.eta", baseData);
    expect(result).toContain("Spinner");
    expect(result).toContain("text-ink-gray-4");
  });

  it("renders a spinner next to the text in Vue", async () => {
    const result = await eta.renderAsync("./loading-text.vue.eta", baseData);
    expect(result).toContain("Spinner.vue");
    expect(result).toContain("text-ink-gray-4");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./loading-text.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./loading-text.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });
});
