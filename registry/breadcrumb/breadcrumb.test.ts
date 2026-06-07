import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { breadcrumbDef } from "./definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eta = new Eta({ views: __dirname });

const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Breadcrumb",
};

describe("breadcrumb definition", () => {
  it("exposes size and separator props", () => {
    expect(breadcrumbDef.name).toBe("breadcrumb");
    expect(breadcrumbDef.props.size.values).toEqual(["sm", "md"]);
    expect(breadcrumbDef.props.separator.values).toEqual(["slash", "chevron"]);
    expect(breadcrumbDef.props.size.default).toBe("md");
    expect(breadcrumbDef.props.separator.default).toBe("slash");
  });

  it("declares lucide peer deps for separator and ellipsis icons", () => {
    expect(breadcrumbDef.peerDeps.react).toContain("lucide-react");
    expect(breadcrumbDef.peerDeps.vue).toContain("@lucide/vue");
  });

  it("exposes maxItems collapse props", () => {
    expect(breadcrumbDef.props.maxItems.type).toBe("number");
    expect(breadcrumbDef.props.itemsBeforeCollapse.default).toBe(1);
    expect(breadcrumbDef.props.itemsAfterCollapse.default).toBeUndefined();
  });

  it("declares collapse as a registry dependency", () => {
    expect(breadcrumbDef.registryDependencies).toContain("collapse");
  });
});

describe("breadcrumb css tokens", () => {
  it("aliases semantic tokens and defines sm/md size tokens", async () => {
    const css = await fs.readFile(path.join(__dirname, "breadcrumb.css"), "utf-8");
    expect(css).toContain("--breadcrumb-link-fg: var(--color-muted-foreground)");
    expect(css).toContain("--breadcrumb-page-fg: var(--color-foreground)");
    expect(css).toContain("--breadcrumb-separator-fg: var(--color-muted-foreground)");
    expect(css).toContain("--breadcrumb-sm-font-size");
    expect(css).toContain("--breadcrumb-md-font-size");
    expect(css).toContain("--breadcrumb-transition-duration: 150ms");
    expect(css).toContain("--breadcrumb-sm-min-height: 32px");
    expect(css).toContain("--breadcrumb-hit-inset");
    expect(css).toContain("--breadcrumb-menu-bg");
    expect(css).toContain("--breadcrumb-menu-item-highlight-bg");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("breadcrumb react template", () => {
  it("exports compound components with accessible nav structure", async () => {
    const result = await eta.renderAsync("./breadcrumb.react.eta", baseData);
    expect(result).toContain('aria-label="Breadcrumb"');
    expect(result).toContain("BreadcrumbList");
    expect(result).toContain("BreadcrumbItem");
    expect(result).toContain("BreadcrumbLink");
    expect(result).toContain("BreadcrumbPage");
    expect(result).toContain("BreadcrumbSeparator");
    expect(result).toContain("BreadcrumbEllipsis");
    expect(result).toContain('aria-current="page"');
    expect(result).toContain("@ark-ui/react/factory");
    expect(result).toContain("ark.a");
  });

  it("supports prefix prop on link and page", async () => {
    const result = await eta.renderAsync("./breadcrumb.react.eta", baseData);
    expect(result).toContain("prefix?: ReactNode");
    expect(result).toContain("{prefix}");
  });

  it("maps separator chevron to lucide ChevronRight", async () => {
    const result = await eta.renderAsync("./breadcrumb.react.eta", baseData);
    expect(result).toContain("ChevronRight");
    expect(result).toContain("MoreHorizontal");
  });

  it("applies interaction UX patterns on links and ellipsis", async () => {
    const result = await eta.renderAsync("./breadcrumb.react.eta", baseData);
    expect(result).toContain("breadcrumbInteractiveVariants");
    expect(result).toContain("breadcrumbPageVariants");
    expect(result).toContain("active:scale-[0.98]");
    expect(result).toContain("duration-(--breadcrumb-transition-duration)");
    expect(result).toContain("--breadcrumb-hit-inset");
    expect(result).toContain("min-h-(--breadcrumb-md-min-height)");
  });

  it("supports maxItems auto-collapse with ellipsis menu", async () => {
    const result = await eta.renderAsync("./breadcrumb.react.eta", baseData);
    expect(result).toContain("maxItems");
    expect(result).toContain("itemsBeforeCollapse");
    expect(result).toContain("itemsAfterCollapse");
    expect(result).toContain('@/lib/collapse"');
    expect(result).toContain("@ark-ui/react/menu");
    expect(result).toContain("getCollapsePlan");
    expect(result).toContain("BreadcrumbCollapsedItem");
    expect(result).toContain("onMouseEnter");
    expect(result).toContain("onMouseLeave");
  });
});

describe("breadcrumb vue template", () => {
  it("exports compound subcomponents with provide/inject", async () => {
    const result = await eta.renderAsync("./breadcrumb.vue.eta", baseData);
    expect(result).toContain('aria-label="Breadcrumb"');
    expect(result).toContain("BreadcrumbList");
    expect(result).toContain("provide(BreadcrumbKey");
    expect(result).toContain("inject<BreadcrumbContextValue>");
  });

  it("uses prefix slot on link and page", async () => {
    const result = await eta.renderAsync("./breadcrumb.vue.eta", baseData);
    expect(result).toContain("slots.prefix");
  });

  it("applies interaction UX patterns on links and ellipsis", async () => {
    const result = await eta.renderAsync("./breadcrumb.vue.eta", baseData);
    expect(result).toContain("breadcrumbInteractiveVariants");
    expect(result).toContain("breadcrumbPageVariants");
    expect(result).toContain("active:scale-[0.98]");
    expect(result).toContain("--breadcrumb-hit-inset");
  });

  it("supports maxItems auto-collapse with ellipsis menu", async () => {
    const result = await eta.renderAsync("./breadcrumb.vue.eta", baseData);
    expect(result).toContain("maxItems");
    expect(result).toContain("itemsBeforeCollapse");
    expect(result).toContain("itemsAfterCollapse");
    expect(result).toContain('@/lib/collapse"');
    expect(result).toContain("@ark-ui/vue/menu");
    expect(result).toContain("getCollapsePlan");
    expect(result).toContain("BreadcrumbCollapsedItem");
    expect(result).toContain("onMouseenter");
    expect(result).toContain("onMouseleave");
  });
});

describe("breadcrumb templates", () => {
  it("renders React template", async () => {
    const result = await eta.renderAsync("./breadcrumb.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./breadcrumb.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./breadcrumb.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
