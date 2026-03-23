/**
 * Preset encoding schema — FROZEN.
 * Field order and bit offsets must never change. New fields append to the end.
 * Changing this would break all existing preset strings.
 */

export type PresetField = {
  offset: number;
  bits: number;
  values?: readonly string[];
};

/** Maps framework enum to numeric index */
export const FRAMEWORKS = ["react", "vue"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

/** Maps styleEngine enum to numeric index */
export const STYLE_ENGINES = ["tailwind"] as const;
export type StyleEngine = (typeof STYLE_ENGINES)[number];

/** Maps darkMode enum to numeric index */
export const DARK_MODES = ["data-attribute", "class", "media-query"] as const;
export type DarkMode = (typeof DARK_MODES)[number];

/** Built-in theme names — append only */
export const BUILT_IN_THEMES = ["espresso"] as const;
export type BuiltInTheme = (typeof BUILT_IN_THEMES)[number];

/**
 * Bit layout (frozen forever):
 *  [0]     1 bit  — framework (0=react, 1=vue)
 *  [1]     1 bit  — typescript (0=false, 1=true)
 *  [2]     1 bit  — styleEngine (0=tailwind)
 *  [3..6]  4 bits — theme.default index (max 16 built-in themes)
 *  [7..8]  2 bits — theme.darkMode (0=data-attribute, 1=class, 2=media-query)
 */
export const SCHEMA = {
  framework: { offset: 0, bits: 1, values: FRAMEWORKS },
  typescript: { offset: 1, bits: 1 },
  styleEngine: { offset: 2, bits: 1, values: STYLE_ENGINES },
  themeDefault: { offset: 3, bits: 4, values: BUILT_IN_THEMES },
  darkMode: { offset: 7, bits: 2, values: DARK_MODES },
} as const satisfies Record<string, PresetField>;

export const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
