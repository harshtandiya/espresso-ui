export type SectionGroup = "intro" | "foundations" | "components";

export type SectionStatus = "stable" | "beta" | "new";

export interface Section {
  id: string;
  label: string;
  group: SectionGroup;
  status?: SectionStatus;
  /** Short label shown in mobile index rows */
  sub?: string;
}

export const SECTIONS: readonly Section[] = [
  { id: "overview", label: "Overview", group: "intro", sub: "intro" },
  { id: "install", label: "Install", group: "intro", sub: "CLI" },
  { id: "color", label: "Color", group: "foundations", sub: "11 + 5" },
  { id: "type", label: "Typography", group: "foundations", sub: "6 styles" },
  { id: "spacing", label: "Spacing", group: "foundations", sub: "12 stops" },
  { id: "radius", label: "Radius", group: "foundations", sub: "6 stops" },
  { id: "avatar", label: "Avatar", group: "components", status: "new", sub: "7 sizes" },
  { id: "avatar-group", label: "Avatar Group", group: "components", status: "new", sub: "stack" },
  { id: "badge", label: "Badge", group: "components", status: "new", sub: "5 themes" },
  { id: "breadcrumb", label: "Breadcrumb", group: "components", status: "new", sub: "compound" },
  { id: "button", label: "Button", group: "components", status: "stable", sub: "stable" },
  { id: "label", label: "Label", group: "components", status: "stable", sub: "stable" },
  {
    id: "text-input",
    label: "Text Input",
    group: "components",
    status: "new",
    sub: "4 sizes",
  },
  { id: "textarea", label: "Textarea", group: "components", status: "new", sub: "4 sizes" },
  { id: "select", label: "Select", group: "components", status: "new", sub: "4 sizes" },
  { id: "checkbox", label: "Checkbox", group: "components", status: "new", sub: "3 sizes" },
  { id: "radio", label: "Radio", group: "components", status: "new", sub: "3 sizes" },
  { id: "switch", label: "Switch", group: "components", status: "new", sub: "3 sizes" },
  {
    id: "form-control",
    label: "Form Control",
    group: "components",
    status: "new",
    sub: "dispatcher",
  },
  {
    id: "error-message",
    label: "Error Message",
    group: "components",
    status: "new",
    sub: "alert",
  },
  { id: "spinner", label: "Spinner", group: "components", status: "new", sub: "4 sizes" },
  { id: "skeleton", label: "Skeleton", group: "components", status: "new", sub: "placeholder" },
  { id: "progress", label: "Progress", group: "components", status: "new", sub: "intervals" },
  { id: "divider", label: "Divider", group: "components", status: "new", sub: "with action" },
  { id: "alert", label: "Alert", group: "components", status: "new", sub: "row · banner" },
  { id: "tooltip", label: "Tooltip", group: "components", status: "new", sub: "4 sides" },
  { id: "tabs", label: "Tabs", group: "components", status: "new", sub: "4 variants" },
  { id: "rating", label: "Rating", group: "components", status: "new", sub: "half stars" },
] as const;

/** Sections reachable via mobile push-nav (excludes intro — shown on home instead). */
export const MOBILE_NAV_SECTIONS: readonly Section[] = SECTIONS.filter((s) => s.group !== "intro");

export const GROUPS: readonly { key: SectionGroup; label: string }[] = [
  { key: "intro", label: "" },
  { key: "foundations", label: "Foundations" },
  { key: "components", label: "Components" },
] as const;

export const MOBILE_BP = 768;

export const INTRO_SECTION_IDS = ["overview", "install"] as const;

export function sectionNumber(id: string): string {
  const idx = SECTIONS.findIndex((s) => s.id === id);
  return String(idx + 1).padStart(2, "0");
}

export function mobileSectionNumber(id: string): string {
  const idx = MOBILE_NAV_SECTIONS.findIndex((s) => s.id === id);
  return String(idx + 1).padStart(2, "0");
}

export function mobileSectionNeighbors(id: string): {
  prev: Section | undefined;
  next: Section | undefined;
} {
  const idx = MOBILE_NAV_SECTIONS.findIndex((s) => s.id === id);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? MOBILE_NAV_SECTIONS[idx - 1] : undefined,
    next: idx < MOBILE_NAV_SECTIONS.length - 1 ? MOBILE_NAV_SECTIONS[idx + 1] : undefined,
  };
}

export function sectionsByGroup(group: SectionGroup): readonly Section[] {
  return SECTIONS.filter((s) => s.group === group);
}

export function sectionSub(section: Section): string {
  if (section.sub) return section.sub;
  if (section.status) return section.status;
  return "";
}

/** Groups shown in the mobile index list (intro content lives on the home screen). */
export function mobileIndexGroups(): readonly { key: SectionGroup; label: string }[] {
  return GROUPS.filter((g) => g.key !== "intro");
}
