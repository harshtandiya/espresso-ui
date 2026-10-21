import { useState } from "react";
import { Copy, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
import { Button } from "@/generated/react/Button.tsx";
import { DropdownMenu } from "@/generated/react/DropdownMenu.tsx";

export function DropdownMenuBasicDemo() {
  const [last, setLast] = useState("nothing yet");

  return (
    <div className="dropdown-demo-stack">
      <DropdownMenu
        trigger={
          <Button
            label="Actions"
            variant="outline"
            icon={<MoreHorizontal aria-hidden="true" className="size-4" />}
          />
        }
        items={[
          { label: "Rename", icon: <Pencil aria-hidden="true" className="size-4" /> },
          { label: "Duplicate", icon: <Copy aria-hidden="true" className="size-4" /> },
          { type: "separator" },
          { label: "Delete", icon: <Trash2 aria-hidden="true" className="size-4" />, danger: true },
        ]}
        onSelect={(label) => setLast(label)}
      />
      <p className="text-sm text-ink-gray-6">Last action: {last}</p>
    </div>
  );
}

export function DropdownMenuGroupDemo() {
  return (
    <DropdownMenu
      trigger={
        <Button
          label="Share"
          variant="outline"
          icon={<Share2 aria-hidden="true" className="size-4" />}
        />
      }
      items={[
        {
          type: "group",
          label: "People",
          items: [{ label: "Invite people" }, { label: "Copy link", shortcut: "⌘C" }],
        },
        {
          type: "group",
          label: "Export",
          items: [
            { label: "As PDF", shortcut: "⌘P" },
            { label: "As CSV" },
            { label: "Raw data", disabled: true },
          ],
        },
      ]}
    />
  );
}
