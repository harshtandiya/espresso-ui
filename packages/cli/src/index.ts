#!/usr/bin/env node
import { Command } from "commander";
import { registerInit } from "./commands/init";
import { registerAdd } from "./commands/add";
import { registerTheme } from "./commands/theme";

const program = new Command();

program
  .name("espresso-ui")
  .description(
    "Framework-agnostic UI component CLI — copies components into your project as editable source code",
  )
  .version("0.1.0");

registerInit(program);
registerAdd(program);
registerTheme(program);

program.parse();
