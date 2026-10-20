import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { errorMessageDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "ErrorMessage",
};

describe("error-message definition", () => {
  it("accepts strings, arrays, and Error objects", () => {
    expect(errorMessageDef.name).toBe("error-message");
    expect(errorMessageDef.props.message.type).toEqual(["string", "array", "object"]);
  });
});

describe("error-message templates", () => {
  it("renders an alert with one line per message in React", async () => {
    const result = await eta.renderAsync("./error-message.react.eta", baseData);
    expect(result).toContain('role="alert"');
    expect(result).toContain("errorLines");
    expect(result).toContain("text-ink-red-7");
    expect(result).toContain("lines.map");
  });

  it("renders an alert with one line per message in Vue", async () => {
    const result = await eta.renderAsync("./error-message.vue.eta", baseData);
    expect(result).toContain('role="alert"');
    expect(result).toContain('v-if="lines.length"');
    expect(result).toContain("errorLines");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./error-message.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./error-message.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./error-message.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
