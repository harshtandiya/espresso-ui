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

  it("exposes indicator and legacy status props in React template", async () => {
    const result = await eta.renderAsync("./avatar.react.eta", baseData);
    expect(result).toContain("indicator?: ReactNode");
    expect(result).toContain("status?: ReactNode");
    expect(result).toContain("statusClassName");
    expect(result).toContain("--avatar-status-bg");
    expect(result).toContain("{indicatorContent}");
    expect(result).not.toContain("StatusBadge");
  });

  it("exposes indicator and legacy status slots in Vue template", async () => {
    const result = await eta.renderAsync("./avatar.vue.eta", baseData);
    expect(result).toContain('<slot name="indicator">');
    expect(result).toContain('<slot name="status" />');
    expect(result).toContain("$slots.indicator");
    expect(result).toContain("$slots.status");
    expect(result).toContain("--avatar-status-bg");
    expect(result).not.toContain('status === "active"');
  });

  it("matches the frappe-ui v1 avatar props", async () => {
    const react = await eta.renderAsync("./avatar.react.eta", baseData);
    const vue = await eta.renderAsync("./avatar.vue.eta", baseData);
    expect(react).toContain("image?: string");
    expect(react).toContain("label?: string");
    expect(react).toContain("theme?: AvatarTheme");
    expect(react).toContain('shape === "square"');
    expect(vue).toContain("image?: string");
    expect(vue).toContain("theme?: AvatarTheme");
    expect(vue).toContain('props.shape === "square"');
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
