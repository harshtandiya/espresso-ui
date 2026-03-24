/**
 * TypeScript types for the shadcn registry JSON schema.
 * Reference: https://ui.shadcn.com/schema/registry.json
 */

export type RegistryItemType =
  | "registry:ui"
  | "registry:block"
  | "registry:style"
  | "registry:base"
  | "registry:lib"
  | "registry:hook"
  | "registry:theme"
  | "registry:page";

export type RegistryFileType =
  | "registry:ui"
  | "registry:component"
  | "registry:lib"
  | "registry:hook"
  | "registry:style"
  | "registry:page";

export type RegistryFile = {
  /** Relative path the file should be written to in the user's project. */
  path: string;
  /** Inline file content. */
  content: string;
  /** Classifies the file so the CLI knows where to place it. */
  type: RegistryFileType;
  /** Target framework for this file, if the item supports multiple. */
  target?: string;
};

export type RegistryCssVars = {
  /** CSS custom properties to inject under the light theme selector. */
  light?: Record<string, string>;
  /** CSS custom properties to inject under the dark theme selector. */
  dark?: Record<string, string>;
};

export type RegistryItem = {
  /** Unique identifier used in `shadcn add <name>`. */
  name: string;
  /** Classification of the item. */
  type: RegistryItemType;
  /** Human-readable display name. */
  title: string;
  /** Short description of what the component does. */
  description: string;
  /** npm package dependencies (e.g. ["clsx", "class-variance-authority"]). */
  dependencies?: string[];
  /** Other registry item names this item depends on. */
  registryDependencies?: string[];
  /** All files that make up this registry item, with inline content. */
  files: RegistryFile[];
  /**
   * CSS custom properties to inject into the user's global stylesheet.
   * We leave this empty — our theming goes through the token pipeline
   * (tokens.css / tailwind.css) rather than per-item cssVars injection.
   */
  cssVars?: RegistryCssVars;
};

export type RegistryRoot = {
  $schema: string;
  /** Short identifier for this registry. */
  name: string;
  /** Homepage URL for the registry. */
  homepage: string;
  /** All items available in this registry. */
  items: RegistryItem[];
};
