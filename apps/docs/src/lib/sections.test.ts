import { describe, expect, it } from "vite-plus/test";
import { SECTIONS, sectionNumber, sectionsByGroup } from "./sections.js";

describe("docs sections", () => {
  it("registers badge in the components group", () => {
    const badge = SECTIONS.find((section) => section.id === "badge");
    expect(badge).toEqual({
      id: "badge",
      label: "Badge",
      group: "components",
      status: "new",
      sub: "5 themes",
    });
  });

  it("assigns badge a stable section number", () => {
    expect(sectionNumber("badge")).toBe("09");
    expect(sectionsByGroup("components").map((section) => section.id)).toContain("badge");
  });

  it("registers breadcrumb in the components group", () => {
    const breadcrumb = SECTIONS.find((section) => section.id === "breadcrumb");
    expect(breadcrumb).toEqual({
      id: "breadcrumb",
      label: "Breadcrumb",
      group: "components",
      status: "new",
      sub: "compound",
    });
  });

  it("assigns breadcrumb a stable section number", () => {
    expect(sectionNumber("breadcrumb")).toBe("10");
    expect(sectionNumber("button")).toBe("11");
  });
});
