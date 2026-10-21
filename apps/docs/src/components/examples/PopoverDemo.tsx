import { Button } from "@/generated/react/Button.tsx";
import { Popover } from "@/generated/react/Popover.tsx";

export function PopoverBasicDemo() {
  return (
    <Popover trigger={<Button label="Open panel" variant="outline" />}>
      <p className="max-w-[220px] text-sm text-ink-gray-7">
        A panel holds anything: a filter, a short form, a list of links.
      </p>
    </Popover>
  );
}

export function PopoverSidesDemo() {
  return (
    <div className="popover-demo-stack">
      <Popover side="bottom" align="start" trigger={<Button label="Bottom" variant="outline" />}>
        <p className="text-sm text-ink-gray-7">Opens below the trigger.</p>
      </Popover>
      <Popover side="right" trigger={<Button label="Right" variant="outline" />}>
        <p className="text-sm text-ink-gray-7">Opens beside the trigger.</p>
      </Popover>
      <Popover side="top" align="end" trigger={<Button label="Top" variant="outline" />}>
        <p className="text-sm text-ink-gray-7">Opens above the trigger.</p>
      </Popover>
    </div>
  );
}

export function PopoverArrowDemo() {
  return (
    <Popover arrow trigger={<Button label="With arrow" variant="outline" />}>
      <p className="max-w-[200px] text-sm text-ink-gray-7">The arrow points back at the trigger.</p>
    </Popover>
  );
}

export function PopoverWidthDemo() {
  return (
    <Popover
      matchTriggerWidth
      trigger={<Button label="Match the trigger width" variant="outline" />}
    >
      <div className="flex flex-col gap-1 text-sm text-ink-gray-7">
        <span>All results</span>
        <span>Files</span>
        <span>Folders</span>
      </div>
    </Popover>
  );
}
