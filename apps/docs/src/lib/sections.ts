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
  { id: "button", label: "Button", group: "components", status: "stable", sub: "stable" },
  { id: "label", label: "Label", group: "components", status: "stable", sub: "stable" },
  { id: "avatar", label: "Avatar", group: "components", status: "new", sub: "7 sizes" },
  { id: "avatar-group", label: "Avatar Group", group: "components", status: "new", sub: "stack" },
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
