export type CollapsePlan = {
  before: number;
  afterStart: number;
};

export function getCollapsePlan(
  total: number,
  maxItems: number,
  itemsBeforeCollapse: number,
  itemsAfterCollapse: number | undefined,
): CollapsePlan | null {
  if (total <= maxItems) return null;

  const before = itemsBeforeCollapse;
  const after = itemsAfterCollapse ?? maxItems - before;

  if (after <= 0 || before + after >= total) return null;

  return {
    before,
    afterStart: total - after,
  };
}
