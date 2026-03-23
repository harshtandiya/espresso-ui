import {
  BASE62_CHARS,
  BUILT_IN_THEMES,
  DARK_MODES,
  FRAMEWORKS,
  SCHEMA,
  STYLE_ENGINES,
  type DarkMode,
  type Framework,
  type StyleEngine,
} from "./schema";
import type { PresetInput } from "./encode";

/** Decode a base62 preset string back into a config object. */
export function decode(preset: string): PresetInput {
  let bits = 0n;
  for (const char of preset) {
    const idx = BASE62_CHARS.indexOf(char);
    if (idx === -1) throw new Error(`Invalid preset character: ${char}`);
    bits = bits * 62n + BigInt(idx);
  }

  const mask = (n: number) => (1n << BigInt(n)) - 1n;
  const get = (offset: number, numBits: number) => Number((bits >> BigInt(offset)) & mask(numBits));

  const frameworkIdx = get(SCHEMA.framework.offset, SCHEMA.framework.bits);
  const typescriptBit = get(SCHEMA.typescript.offset, SCHEMA.typescript.bits);
  const styleEngineIdx = get(SCHEMA.styleEngine.offset, SCHEMA.styleEngine.bits);
  const themeIdx = get(SCHEMA.themeDefault.offset, SCHEMA.themeDefault.bits);
  const darkModeIdx = get(SCHEMA.darkMode.offset, SCHEMA.darkMode.bits);

  return {
    framework: (FRAMEWORKS[frameworkIdx] ?? "react") as Framework,
    typescript: typescriptBit === 1,
    styleEngine: (STYLE_ENGINES[styleEngineIdx] ?? "tailwind") as StyleEngine,
    themeDefault: BUILT_IN_THEMES[themeIdx] ?? "espresso",
    darkMode: (DARK_MODES[darkModeIdx] ?? "data-attribute") as DarkMode,
  };
}
