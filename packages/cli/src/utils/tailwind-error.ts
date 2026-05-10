import type { TailwindStatus } from "./detect-tailwind.js";

const SETUP_URL = "https://espresso-ui.dev/docs/tailwind-setup";

/**
 * Build a human-readable, actionable error message for a failed Tailwind detection.
 * Caller is responsible for printing (e.g. via Clack `p.log.error`).
 */
export function formatTailwindError(status: TailwindStatus): string {
  if (status.ok) return "";

  const header = "Tailwind v4 is required.";

  if (status.reason === "missing") {
    return [
      header,
      "",
      `Reason: ${status.detail}`,
      "",
      "espresso-ui components are styled with Tailwind v4 utilities.",
      "Install it before running this command:",
      "",
      "  pnpm add -D tailwindcss@^4 @tailwindcss/vite@^4",
      "",
      'Then add to your CSS entry: @import "tailwindcss";',
      "",
      `Setup guide: ${SETUP_URL}`,
    ].join("\n");
  }

  if (status.reason === "v3-found") {
    return [
      header,
      "",
      `Reason: ${status.detail}`,
      "",
      "espresso-ui only supports Tailwind v4. Tailwind v3 uses a different config",
      "and theme syntax that is incompatible with our component CSS.",
      "",
      "Upgrade with:",
      "",
      "  pnpm add -D tailwindcss@^4 @tailwindcss/vite@^4",
      "",
      `Migration guide: ${SETUP_URL}`,
    ].join("\n");
  }

  // no-import
  return [
    header,
    "",
    `Reason: ${status.detail}`,
    "",
    "Add the Tailwind v4 directive to the top of your CSS entry:",
    "",
    '  @import "tailwindcss";',
    "",
    `Setup guide: ${SETUP_URL}`,
  ].join("\n");
}
