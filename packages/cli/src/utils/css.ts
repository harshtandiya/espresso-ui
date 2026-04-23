import fs from "node:fs/promises";

const COMPONENT_MARKER_START = (name: string): string => `/* espresso:${name}:start */`;
const COMPONENT_MARKER_END = (name: string): string => `/* espresso:${name}:end */`;

export function hasComponentTokens(cssContent: string, componentName: string): boolean {
  return cssContent.includes(COMPONENT_MARKER_START(componentName));
}

export async function appendComponentTokens(
  cssFilePath: string,
  componentName: string,
  componentCss: string,
): Promise<{ appended: boolean }> {
  let existing: string;
  try {
    existing = await fs.readFile(cssFilePath, "utf-8");
  } catch {
    throw new Error(`Global CSS file not found at ${cssFilePath}. Run "espresso-ui init" first.`);
  }

  if (hasComponentTokens(existing, componentName)) {
    return { appended: false };
  }

  const wrappedCss = `
${COMPONENT_MARKER_START(componentName)}
${componentCss.trim()}
${COMPONENT_MARKER_END(componentName)}
`;

  await fs.writeFile(cssFilePath, existing.trimEnd() + "\n" + wrappedCss, "utf-8");
  return { appended: true };
}
