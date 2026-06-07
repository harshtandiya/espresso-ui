export type CollapsePlan = {
  /** Number of items to keep visible at the start. */
  before: number;
  /** Index in the original array where the visible tail begins. */
  afterStart: number;
};

/**
 * Compute which items to collapse when a list exceeds `maxItems`.
 *
 * Returns `null` when no collapsing is needed (total ≤ maxItems or the
 * before/after counts already cover all items). The caller slices the
 * original array with the returned indices:
 *
 *   visible = [...items.slice(0, plan.before), ELLIPSIS, ...items.slice(plan.afterStart)]
 */
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
