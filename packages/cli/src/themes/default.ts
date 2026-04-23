export const tailwindThemeBlock = `@theme inline {
  --color-background: var(--color-background);
  --color-foreground: var(--color-foreground);
  --color-card: var(--color-card);
  --color-card-foreground: var(--color-card-foreground);
  --color-popover: var(--color-popover);
  --color-popover-foreground: var(--color-popover-foreground);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-foreground);
  --color-secondary: var(--color-secondary);
  --color-secondary-foreground: var(--color-secondary-foreground);
  --color-muted: var(--color-muted);
  --color-muted-foreground: var(--color-muted-foreground);
  --color-accent: var(--color-accent);
  --color-accent-foreground: var(--color-accent-foreground);
  --color-destructive: var(--color-destructive);
  --color-destructive-foreground: var(--color-destructive-foreground);
  --color-border: var(--color-border);
  --color-input: var(--color-input);
  --color-ring: var(--color-ring);
  --color-info: var(--color-info);
  --color-info-foreground: var(--color-info-foreground);
  --color-info-subtle: var(--color-info-subtle);
  --color-success: var(--color-success);
  --color-success-foreground: var(--color-success-foreground);
  --color-success-subtle: var(--color-success-subtle);
  --color-warning: var(--color-warning);
  --color-warning-foreground: var(--color-warning-foreground);
  --color-warning-subtle: var(--color-warning-subtle);
  --color-error: var(--color-error);
  --color-error-foreground: var(--color-error-foreground);
  --color-error-subtle: var(--color-error-subtle);
  --shadow-sm: var(--shadow-sm);
  --shadow-base: var(--shadow-base);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --radius-2xl: var(--radius-2xl);
  --radius-3xl: var(--radius-3xl);
  --radius-full: var(--radius-full);
}`;

export const lightTokens = `  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.2046 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.2046 0 0);
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.2046 0 0);
  --color-primary: oklch(0.2046 0 0);
  --color-primary-foreground: oklch(1 0 0);
  --color-secondary: oklch(0.9642 0 0);
  --color-secondary-foreground: oklch(0.2046 0 0);
  --color-muted: oklch(0.9642 0 0);
  --color-muted-foreground: oklch(0.683 0 0);
  --color-accent: oklch(0.9642 0 0);
  --color-accent-foreground: oklch(0.2046 0 0);
  --color-destructive: oklch(0.5972 0.2064 26.11);
  --color-destructive-foreground: oklch(1 0 0);
  --color-border: oklch(0.9461 0 0);
  --color-input: oklch(0.9461 0 0);
  --color-ring: oklch(0.2046 0 0);
  --color-info: oklch(0.6289 0.1908 252.57);
  --color-info-foreground: oklch(1 0 0);
  --color-info-subtle: oklch(0.9786 0.0109 243.65);
  --color-success: oklch(0.7173 0.1159 160.33);
  --color-success-foreground: oklch(1 0 0);
  --color-success-subtle: oklch(0.9834 0.0165 151.11);
  --color-warning: oklch(0.7431 0.1555 72.09);
  --color-warning-foreground: oklch(1 0 0);
  --color-warning-subtle: oklch(0.9839 0.0174 96.1);
  --color-error: oklch(0.5972 0.2064 26.11);
  --color-error-foreground: oklch(1 0 0);
  --color-error-subtle: oklch(0.9823 0.0086 17.3);
  --shadow-sm: 0 1px 1.75px oklch(0 0 0 / 0.10);
  --shadow-base: 0 1px 1.75px oklch(0 0 0 / 0.10), 0 0 0.875px oklch(0 0 0 / 0.45);
  --shadow-md: 0 2px 2.625px oklch(0 0 0 / 0.16), 0 0.5px 1.75px oklch(0 0 0 / 0.15), 0 0 0.875px oklch(0 0 0 / 0.12);
  --shadow-lg: 0 6px 7px -4px oklch(0 0 0 / 0.10), 0 0 0.875px oklch(0 0 0 / 0.35);
  --shadow-xl: 0 6px 13.125px -5px oklch(0 0 0 / 0.11), 0 1px 1.75px oklch(0 0 0 / 0.07), 0 0 0.875px oklch(0 0 0 / 0.19);
  --shadow-2xl: 0 10px 21px -3px oklch(0 0 0 / 0.10), 0 1px 2.625px oklch(0 0 0 / 0.05), 0 0 0.875px oklch(0 0 0 / 0.20);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 20px;
  --radius-full: 9999px;`;

export const darkTokens = `  --color-background: oklch(0.09 0 0);
  --color-foreground: oklch(0.9791 0 0);
  --color-card: oklch(0.145 0 0);
  --color-card-foreground: oklch(0.9791 0 0);
  --color-popover: oklch(0.145 0 0);
  --color-popover-foreground: oklch(0.9791 0 0);
  --color-primary: oklch(0.9791 0 0);
  --color-primary-foreground: oklch(0.2046 0 0);
  --color-secondary: oklch(0.3407 0 0);
  --color-secondary-foreground: oklch(0.9791 0 0);
  --color-muted: oklch(0.3407 0 0);
  --color-muted-foreground: oklch(0.8297 0 0);
  --color-accent: oklch(0.3407 0 0);
  --color-accent-foreground: oklch(0.9791 0 0);
  --color-destructive: oklch(0.5503 0.1985 26.77);
  --color-destructive-foreground: oklch(1 0 0);
  --color-border: oklch(0.4386 0 0);
  --color-input: oklch(0.4386 0 0);
  --color-ring: oklch(0.9128 0 0);
  --color-info: oklch(0.768 0.1118 244.71);
  --color-info-foreground: oklch(0.2046 0 0);
  --color-info-subtle: oklch(0.2 0.04 240);
  --color-success: oklch(0.8584 0.0972 156.07);
  --color-success-foreground: oklch(0.2046 0 0);
  --color-success-subtle: oklch(0.2 0.04 150);
  --color-warning: oklch(0.865 0.144 87.19);
  --color-warning-foreground: oklch(0.2046 0 0);
  --color-warning-subtle: oklch(0.22 0.05 85);
  --color-error: oklch(0.7717 0.1183 19.5);
  --color-error-foreground: oklch(0.2046 0 0);
  --color-error-subtle: oklch(0.2 0.04 20);
  --shadow-sm: 0 1px 1.75px oklch(0 0 0 / 0.30);
  --shadow-base: 0 1px 1.75px oklch(0 0 0 / 0.30), 0 0 0.875px oklch(0 0 0 / 0.60);
  --shadow-md: 0 2px 2.625px oklch(0 0 0 / 0.40), 0 0.5px 1.75px oklch(0 0 0 / 0.35), 0 0 0.875px oklch(0 0 0 / 0.30);
  --shadow-lg: 0 6px 7px -4px oklch(0 0 0 / 0.35), 0 0 0.875px oklch(0 0 0 / 0.50);
  --shadow-xl: 0 6px 13.125px -5px oklch(0 0 0 / 0.40), 0 1px 1.75px oklch(0 0 0 / 0.25), 0 0 0.875px oklch(0 0 0 / 0.40);
  --shadow-2xl: 0 10px 21px -3px oklch(0 0 0 / 0.45), 0 1px 2.625px oklch(0 0 0 / 0.20), 0 0 0.875px oklch(0 0 0 / 0.40);`;

export function getDarkModeSelector(darkMode: "data-attribute" | "class" | "media-query"): string {
  switch (darkMode) {
    case "data-attribute":
      return '[data-theme="dark"]';
    case "class":
      return ".dark";
    case "media-query":
      return "@media (prefers-color-scheme: dark)";
  }
}

export function generateGlobalCss(darkMode: "data-attribute" | "class" | "media-query"): string {
  const darkSelector = getDarkModeSelector(darkMode);
  const isMediaQuery = darkMode === "media-query";

  let css = `/* Generated by espresso-ui — https://espresso-ui.dev */
@import "tailwindcss";

${tailwindThemeBlock}

:root {
${lightTokens}
}

`;

  if (isMediaQuery) {
    css += `${darkSelector} {
  :root {
${darkTokens}
  }
}
`;
  } else {
    css += `${darkSelector} {
${darkTokens}
}
`;
  }

  return css;
}
