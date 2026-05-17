import { expect, test } from "vite-plus/test";
import { cssVar } from "../src";

test("cssVar wraps token name in var()", () => {
  expect(cssVar("color-primary")).toBe("var(--color-primary)");
});

test("cssVar accepts ink ramp tokens", () => {
  expect(cssVar("color-ink-1")).toBe("var(--color-ink-1)");
  expect(cssVar("color-ink-5")).toBe("var(--color-ink-5)");
});

test("cssVar accepts line and surface ramp tokens", () => {
  expect(cssVar("color-line")).toBe("var(--color-line)");
  expect(cssVar("color-line-2")).toBe("var(--color-line-2)");
  expect(cssVar("color-surface")).toBe("var(--color-surface)");
  expect(cssVar("color-surface-2")).toBe("var(--color-surface-2)");
  expect(cssVar("color-surface-3")).toBe("var(--color-surface-3)");
});
