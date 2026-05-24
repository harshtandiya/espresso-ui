#!/usr/bin/env node
import { createRequire } from "node:module";
import { Command } from "commander";
import { registerInit } from "./commands/init";
import { registerAdd } from "./commands/add";
import { registerTheme } from "./commands/theme";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

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
