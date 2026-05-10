import { expect, test } from "vite-plus/test";
import { formatTailwindError } from "../src/utils/tailwind-error";
import type { TailwindStatus } from "../src/utils/detect-tailwind";

test("missing reason mentions install command", () => {
  const status: TailwindStatus = { ok: false, reason: "missing", detail: "x" };

  const msg = formatTailwindError(status);

  expect(msg).toContain("Tailwind v4");
  expect(msg).toContain("tailwindcss@^4");
  expect(msg).toContain("@tailwindcss/vite");
});

test("v3-found reason mentions upgrade", () => {
  const status: TailwindStatus = { ok: false, reason: "v3-found", detail: "found 3.4.0" };

  const msg = formatTailwindError(status);

  expect(msg).toContain("v3");
  expect(msg).toContain("v4");
  expect(msg).toContain("found 3.4.0");
});

test("no-import reason mentions @import directive", () => {
  const status: TailwindStatus = {
    ok: false,
    reason: "no-import",
    detail: "src/x.css missing import",
  };

  const msg = formatTailwindError(status);

  expect(msg).toContain('@import "tailwindcss"');
  expect(msg).toContain("src/x.css");
});

test("includes setup guide URL in every variant", () => {
  const reasons: TailwindStatus[] = [
    { ok: false, reason: "missing", detail: "" },
    { ok: false, reason: "v3-found", detail: "" },
    { ok: false, reason: "no-import", detail: "" },
  ];
  for (const status of reasons) {
    expect(formatTailwindError(status)).toContain("espresso-ui.dev");
  }
});
