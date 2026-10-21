import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/generated/react/Button.tsx";
import { Dialog } from "@/generated/react/Dialog.tsx";

export function DialogBasicDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button label="Share document" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Share document"
        message="Anyone with the link can view this document."
        actions={[
          { label: "Cancel", variant: "subtle" },
          {
            label: "Copy link",
            variant: "solid",
            theme: "blue",
            onClick: async () => {
              await new Promise((resolve) => setTimeout(resolve, 700));
              setOpen(false);
            },
          },
        ]}
      />
    </>
  );
}

export function DialogIconDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        theme="red"
        variant="outline"
        label="Delete project"
        icon={<Trash2 aria-hidden="true" className="size-4" />}
        onClick={() => setOpen(true)}
      />
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete project"
        message="This removes the project and everything in it. This cannot be undone."
        icon={<AlertTriangle aria-hidden="true" className="size-4" />}
        theme="red"
        actions={[
          { label: "Cancel", variant: "subtle" },
          { label: "Delete", variant: "solid", theme: "red" },
        ]}
      />
    </>
  );
}

export function DialogBareDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button label="Pick a workspace" onClick={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={setOpen} bare>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-ink-gray-8">Pick a workspace</h3>
          <p className="mt-1 text-sm text-ink-gray-6">This is where new pages go.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button label="Not now" variant="subtle" onClick={() => setOpen(false)} />
            <Button label="Continue" variant="solid" theme="blue" onClick={() => setOpen(false)} />
          </div>
        </div>
      </Dialog>
    </>
  );
}

export function DialogSizesDemo() {
  const [size, setSize] = useState<"sm" | "md" | "xl" | null>(null);

  return (
    <div className="dialog-demo-stack">
      {(["sm", "md", "xl"] as const).map((value) => (
        <Button
          key={value}
          label={`Open ${value} dialog`}
          variant="outline"
          onClick={() => setSize(value)}
        />
      ))}
      <Dialog
        open={size !== null}
        onOpenChange={(next) => !next && setSize(null)}
        size={size ?? "md"}
        title={`${size?.toUpperCase()} dialog`}
        message="The card grows with the size, up to the width of the page."
        actions={[{ label: "Close", variant: "subtle" }]}
      />
    </div>
  );
}
