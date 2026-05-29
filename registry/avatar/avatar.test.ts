import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Avatar",
};

describe("avatar templates", () => {
  it("includes lucide User import in React template", async () => {
    const result = await eta.renderAsync("./avatar.react.eta", baseData);
    expect(result).toContain('from "lucide-react"');
    expect(result).toContain("User");
  });

  it("includes lucide User import in Vue template", async () => {
    const result = await eta.renderAsync("./avatar.vue.eta", baseData);
    expect(result).toContain('from "@lucide/vue"');
    expect(result).toContain("User");
  });

  it("exposes a composable status prop in React template", async () => {
    const result = await eta.renderAsync("./avatar.react.eta", baseData);
    expect(result).toContain("status?: ReactNode");
    expect(result).toContain("statusClassName");
    expect(result).toContain("--avatar-status-bg");
    expect(result).toContain("{status}");
    expect(result).not.toContain("StatusBadge");
  });

  it("exposes a status slot in Vue template", async () => {
    const result = await eta.renderAsync("./avatar.vue.eta", baseData);
    expect(result).toContain('<slot name="status" />');
    expect(result).toContain("$slots.status");
    expect(result).toContain("--avatar-status-bg");
    expect(result).not.toContain('status === "active"');
  });

  it("keeps avatar face separate from overlay content", async () => {
    const result = await eta.renderAsync("./avatar.react.eta", baseData);
    expect(result).toContain("avatarFaceVariants");
    expect(result).toContain("overflow-hidden");
  });

  it("maps size md to md token classes in React template", async () => {
    const result = await eta.renderAsync("./avatar.react.eta", baseData);
    expect(result).toContain("--avatar-md-size");
    expect(result).toContain("--avatar-md-font-size");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./avatar.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./avatar.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./avatar.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
