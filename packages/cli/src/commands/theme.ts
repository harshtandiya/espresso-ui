import * as p from "@clack/prompts";
import type { Command } from "commander";

const BUILT_IN_THEMES = ["espresso"] as const;

export function registerTheme(program: Command): void {
  const theme = program.command("theme").description("Manage themes");

  theme
    .command("list")
    .description("List available themes")
    .action(() => {
      p.intro("Available themes");
      for (const name of BUILT_IN_THEMES) {
        p.log.info(`  • ${name}`);
      }
      p.outro('Run "espresso-ui theme add <name>" to add a theme.');
    });

  theme
    .command("add <name>")
    .description("Add a theme to your project")
    .action((name: string) => {
      p.log.warn(`theme add ${name} — coming soon`);
    });

  theme
    .command("init")
    .description("Scaffold a custom theme file")
    .action(() => {
      p.log.warn("theme init — coming soon");
    });
}
