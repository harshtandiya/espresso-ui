#!/usr/bin/env node
import { Command } from "commander";
import { registerInit } from "./commands/init";
import { registerAdd } from "./commands/add";
import { registerTheme } from "./commands/theme";
import { readPackageJson } from "./utils/package-root.js";

const { version } = readPackageJson();

const program = new Command();

program
  .name("espresso-ui")
  .description(
    "Framework-agnostic UI component CLI — copies components into your project as editable source code",
  )
  .version(version);

registerInit(program);
registerAdd(program);
registerTheme(program);

program.parse();
