import { KeyboardShortcut } from "@/generated/react/KeyboardShortcut.tsx";

export function KeyboardShortcutPlainDemo() {
  return (
    <div className="shortcut-demo-stack">
      <KeyboardShortcut combo="Mod+K" />
      <KeyboardShortcut combo="Mod+Shift+K" />
      <KeyboardShortcut combo="Ctrl+Alt+Delete" />
      <KeyboardShortcut combo="ArrowUp+Enter" />
    </div>
  );
}

export function KeyboardShortcutChipDemo() {
  return (
    <div className="shortcut-demo-stack">
      <KeyboardShortcut combo="Mod+K" bg />
      <KeyboardShortcut combo="Mod+Shift+P" bg />
      <KeyboardShortcut combo="Shift+?" bg />
    </div>
  );
}

export function KeyboardShortcutAltDemo() {
  return (
    <div className="shortcut-demo-stack">
      <KeyboardShortcut combo="Mod+S" altCombos={["Ctrl+S"]} />
      <KeyboardShortcut combo="Mod+S" bg altCombos={["Ctrl+S"]} />
    </div>
  );
}
