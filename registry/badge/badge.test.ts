import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { badgeDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Badge",
};

describe("badge definition", () => {
  it("exposes theme, variant, and size props", () => {
    expect(badgeDef.name).toBe("badge");
    expect(badgeDef.props.theme.values).toEqual([
      "gray",
      "blue",
      "green",
      "amber",
      "red",
      "violet",
      "default",
      "error",
      "warning",
      "success",
      "info",
    ]);
    expect(badgeDef.props.variant.values).toEqual(["solid", "subtle", "outline", "ghost"]);
    expect(badgeDef.props.size.values).toEqual(["sm", "md", "lg"]);
  });

  it("declares default, prefix, and suffix slots", () => {
    expect(badgeDef.slots).toEqual(["default", "prefix", "suffix"]);
  });
});

describe("badge css tokens", () => {
  it("defines the frappe-ui v1 size scale", async () => {
    const css = await fs.readFile(path.join(__dirname, "badge.css"), "utf-8");
    expect(css).toContain("--badge-sm-height: 16px");
    expect(css).toContain("--badge-md-height: 20px");
    expect(css).toContain("--badge-lg-height: 24px");
    expect(css).toContain("--badge-radius: var(--radius-full)");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("badge templates", () => {
  it("uses ark.span in React template", async () => {
    const result = await eta.renderAsync("./badge.react.eta", baseData);
    expect(result).toContain("@ark-ui/react/factory");
    expect(result).toContain("ark.span");
    expect(result).not.toContain("asChild");
  });

  it("exposes prefix and suffix props in React template", async () => {
    const result = await eta.renderAsync("./badge.react.eta", baseData);
    expect(result).toContain(
      'Omit<ComponentPropsWithoutRef<typeof ark.span>, "prefix" | "suffix">',
    );
    expect(result).toContain("prefix?: ReactNode");
    expect(result).toContain("suffix?: ReactNode");
    expect(result).toContain("{prefix}");
    expect(result).toContain("{suffix}");
  });

  it("exposes prefix and suffix slots in Vue template", async () => {
    const result = await eta.renderAsync("./badge.vue.eta", baseData);
    expect(result).toContain('<slot name="prefix" />');
    expect(result).toContain('<slot name="suffix" />');
    expect(result).toContain("$slots.prefix");
    expect(result).toContain("$slots.suffix");
  });

  it("maps theme and variant props to cva compound variants", async () => {
    const result = await eta.renderAsync("./badge.react.eta", baseData);
    expect(result).toContain("theme: {");
    expect(result).toContain("gray");
    expect(result).toContain("blue");
    expect(result).toContain("green");
    expect(result).toContain("amber");
    expect(result).toContain("red");
    expect(result).toContain("violet");
    expect(result).toContain("themeAliases");
    expect(result).toContain("variant: {");
    expect(result).toContain("solid");
    expect(result).toContain("subtle");
    expect(result).toContain("outline");
    expect(result).toContain("ghost");
    expect(result).toContain("compoundVariants");
  });

  it("maps size md to md token classes in React template", async () => {
    const result = await eta.renderAsync("./badge.react.eta", baseData);
    expect(result).toContain("--badge-md-height");
    expect(result).toContain("--badge-md-px");
    expect(result).toContain("--badge-md-font-size");
    expect(result).toContain("--badge-md-icon-size");
    expect(result).toContain("--badge-radius");
    expect(result).toContain("[&_svg]:size-(--badge-md-icon-size)");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./badge.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./badge.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./badge.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
