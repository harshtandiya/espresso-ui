# @espresso-ui/cli

Framework-agnostic UI component CLI for React and Vue. Copies editable source into your project, shadcn-style.

## Install

Install globally once:

```bash
npm install -g @espresso-ui/cli
```

Requires Node.js 22.12+.

## Commands

| Command            | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| `init`             | Scaffold `espresso.config.json`, global CSS, and shared dependencies |
| `add <component>`  | Copy a component into your project as editable source                |
| `theme list`       | List available themes                                                |
| `theme add <name>` | Add a theme to your project                                          |
| `theme init`       | Create a custom theme file                                           |

## Quick start

```bash
npm install -g @espresso-ui/cli
espresso-ui init
espresso-ui add button
```

Import the generated global CSS in your app entry:

```css
@import "./styles/espresso.css";
```

Then use the component:

```tsx
import { Button } from "@/components/Button";

export default function App() {
  return <Button>Hello</Button>;
}
```

## Documentation

Full docs: [github.com/harshtandiya/espresso-ui](https://github.com/harshtandiya/espresso-ui)

## License

MIT
