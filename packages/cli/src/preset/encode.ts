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

export type PresetInput = {
  framework: Framework;
  typescript: boolean;
  styleEngine: StyleEngine;
  themeDefault: string;
  darkMode: DarkMode;
};

/** Encode a config object into a base62 preset string. */
export function encode(config: PresetInput): string {
  let bits = 0n;

  const frameworkIdx = FRAMEWORKS.indexOf(config.framework);
  bits |= BigInt(frameworkIdx) << BigInt(SCHEMA.framework.offset);

  bits |= BigInt(config.typescript ? 1 : 0) << BigInt(SCHEMA.typescript.offset);

  const styleEngineIdx = STYLE_ENGINES.indexOf(config.styleEngine);
  bits |= BigInt(styleEngineIdx) << BigInt(SCHEMA.styleEngine.offset);

  const themeIdx = BUILT_IN_THEMES.indexOf(config.themeDefault as (typeof BUILT_IN_THEMES)[number]);
  bits |= BigInt(themeIdx >= 0 ? themeIdx : 0) << BigInt(SCHEMA.themeDefault.offset);

  const darkModeIdx = DARK_MODES.indexOf(config.darkMode);
  bits |= BigInt(darkModeIdx) << BigInt(SCHEMA.darkMode.offset);

  if (bits === 0n) return BASE62_CHARS[0];

  let result = "";
  let n = bits;
  while (n > 0n) {
    result = BASE62_CHARS[Number(n % 62n)] + result;
    n /= 62n;
  }
  return result;
}
