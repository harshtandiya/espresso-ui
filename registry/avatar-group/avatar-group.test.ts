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
  componentName: "AvatarGroup",
};

describe("avatar-group templates", () => {
  it("imports Avatar in React template", async () => {
    const result = await eta.renderAsync("./avatar-group.react.eta", baseData);
    expect(result).toContain('from "./Avatar"');
    expect(result).toContain("<Avatar");
  });

  it("renders overflow counter text in React template", async () => {
    const result = await eta.renderAsync("./avatar-group.react.eta", baseData);
    expect(result).toContain("overflowCount");
    expect(result).toContain("`+${overflowCount}`");
  });

  it("renders member count label when showCount is true", async () => {
    const result = await eta.renderAsync("./avatar-group.react.eta", baseData);
    expect(result).toContain("showCount");
    expect(result).toContain("members");
  });

  it("includes negative overlap token classes in React template", async () => {
    const result = await eta.renderAsync("./avatar-group.react.eta", baseData);
    expect(result).toContain("-ml-(--avatar-group-overlap-md)");
  });

  it("renders avatar groups with circle avatars only", async () => {
    const result = await eta.renderAsync("./avatar-group.react.eta", baseData);
    expect(result).toContain('shape="circle"');
    expect(result).not.toContain("shape={shape}");
  });

  it("applies overlap ring to the avatar face, not the square root wrapper", async () => {
    const result = await eta.renderAsync("./avatar-group.react.eta", baseData);
    expect(result).toContain("[&>span:first-child]:[box-shadow:");
    expect(result).not.toContain("ring-(--avatar-group-ring)");
  });

  it("stacks avatars with the leftmost item on top", async () => {
    const result = await eta.renderAsync("./avatar-group.react.eta", baseData);
    expect(result).toContain("zIndex: visibleItems.length - index");
    expect(result).toContain("zIndex: 0");
  });

  it("renders React template", async () => {
    const result = await eta.renderAsync("./avatar-group.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./avatar-group.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./avatar-group.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
