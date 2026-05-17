export type SectionGroup = "intro" | "foundations" | "components";

export type SectionStatus = "stable" | "beta" | "new";

export interface Section {
  id: string;
  label: string;
  group: SectionGroup;
  status?: SectionStatus;
}

export const SECTIONS: readonly Section[] = [
  { id: "overview", label: "Overview", group: "intro" },
  { id: "install", label: "Install", group: "intro" },
  { id: "color", label: "Color", group: "foundations" },
  { id: "type", label: "Typography", group: "foundations" },
  { id: "spacing", label: "Spacing", group: "foundations" },
  { id: "radius", label: "Radius", group: "foundations" },
  { id: "button", label: "Button", group: "components", status: "stable" },
  { id: "label", label: "Label", group: "components", status: "stable" },
] as const;

export const GROUPS: readonly { key: SectionGroup; label: string }[] = [
  { key: "intro", label: "" },
  { key: "foundations", label: "Foundations" },
  { key: "components", label: "Components" },
] as const;

export function sectionNumber(id: string): string {
  const idx = SECTIONS.findIndex((s) => s.id === id);
  return String(idx + 1).padStart(2, "0");
}

export function sectionsByGroup(group: SectionGroup): readonly Section[] {
  return SECTIONS.filter((s) => s.group === group);
}
