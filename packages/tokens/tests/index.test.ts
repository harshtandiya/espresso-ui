import { expect, test } from "vite-plus/test";
import { cssVar } from "../src";

test("cssVar wraps token name in var()", () => {
  expect(cssVar("color-primary")).toBe("var(--color-primary)");
});
