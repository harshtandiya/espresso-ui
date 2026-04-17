---
name: testing-component
description: Use when verifying a newly built or modified espresso-ui component renders correctly in both test apps — covers starting dev servers, Playwright MCP browser checks, dark mode, and component-specific interaction tests.
---

# Testing a Component in the Browser

Verify components in both test apps using the Playwright MCP browser tools.

## Dev servers

```bash
# React app on 5173, Vue app on 5174 (different ports to run simultaneously)
cd /Users/harsh/dev/espresso-ui/test-app     && pnpm dev --port 5173 &
cd /Users/harsh/dev/espresso-ui/test-app-vue && pnpm dev --port 5174 &
sleep 3   # wait for both to be ready
```

If servers are already running, skip this step.

---

## Playwright MCP tools

| Tool                                                         | When to use                                  |
| ------------------------------------------------------------ | -------------------------------------------- |
| `mcp__plugin_playwright_playwright__browser_navigate`        | Go to a URL                                  |
| `mcp__plugin_playwright_playwright__browser_snapshot`        | Get accessibility tree (use before clicking) |
| `mcp__plugin_playwright_playwright__browser_take_screenshot` | Visual check                                 |
| `mcp__plugin_playwright_playwright__browser_click`           | Click a ref from snapshot                    |

---

## Standard checklist (run for every component)

### React app (port 5173)

1. Navigate to `http://localhost:5173`
2. Take screenshot — verify component section renders without layout breaks
3. Check snapshot — confirm expected elements are present (labels, inputs, buttons etc.)
4. Toggle dark mode (click "Toggle dark mode" button) → take screenshot → verify tokens resolve in dark

### Vue app (port 5174)

Repeat the same 4 steps at `http://localhost:5174`.

### Console errors

After navigating, check the console errors count in the Playwright result. Zero errors expected. If errors appear, read and fix before proceeding.

---

## Component-specific tests

Run these in addition to the standard checklist based on component type:

### Form inputs (Input, Textarea, Select)

```
- Click into the input → verify focus ring appears (ring-(--input-border-focus))
- Type text → verify it appears
- Test disabled state → input should be non-interactive
- Test error variant → border should switch to error color
```

### Checkboxes / Radio buttons

```
- Click to toggle → verify checked state (background color changes)
- Test indeterminate state if applicable
- Verify disabled state prevents interaction
```

### Switch

```
- Click toggle → thumb should slide, track color changes
- Verify CSS transition plays (not instant jump)
- Test disabled state
```

### Label

```
- Click label associated with an input via htmlFor/for → input should receive focus
- Verify disabled label has muted color
```

### State-bearing components (Accordion, Dialog, etc.)

```
- Open/close the component → verify data-[state=open] classes apply
- Test keyboard navigation if applicable
- Verify focus trap if modal
```

---

## What to look for in screenshots

- Component section visible and not overflowing
- Typography token (`[font-size:var(--*)]`) rendering — text should be styled, not default browser size
- Colors match the token intent (primary = dark/accent, muted = gray)
- Dark mode: background goes dark, text goes light, component tokens follow
- No unstyled / broken states

---

## If something looks wrong

1. Inspect the element in snapshot for `data-disabled`, `data-state` attributes
2. Evaluate CSS variables with:
   ```bash
   # Use browser_evaluate to check resolved token value
   # (via Playwright MCP browser_evaluate tool if available, or check in DevTools)
   ```
3. Check `main.css` for missing `@import "./components/<name>.css"`
4. Verify Tailwind class uses `(--var)` not `[--var]` — brackets generate empty rules in v4
5. Font-size not applying? It must use `[font-size:var(--token)]` not `text-(--token)`
