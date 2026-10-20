import { Button } from "@/generated/react/Button.tsx";
import { Tooltip } from "@/generated/react/Tooltip.tsx";

export function TooltipToolbarDemo() {
  return (
    <div className="tooltip-row">
      <Tooltip text="Bold">
        <Button size="sm" variant="outline">
          Bold
        </Button>
      </Tooltip>
      <Tooltip text="Italic">
        <Button size="sm" variant="outline">
          Italic
        </Button>
      </Tooltip>
      <Tooltip text="Underline">
        <Button size="sm" variant="outline">
          Underline
        </Button>
      </Tooltip>
    </div>
  );
}

export function TooltipSidesDemo() {
  return (
    <div className="tooltip-sides">
      <Tooltip text="Top" side="top">
        <Button size="sm" variant="subtle">
          Top
        </Button>
      </Tooltip>
      <Tooltip text="Right" side="right">
        <Button size="sm" variant="subtle">
          Right
        </Button>
      </Tooltip>
      <Tooltip text="Bottom" side="bottom">
        <Button size="sm" variant="subtle">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip text="Left" side="left">
        <Button size="sm" variant="subtle">
          Left
        </Button>
      </Tooltip>
    </div>
  );
}

export function TooltipContentDemo() {
  return (
    <div className="tooltip-row">
      <Tooltip
        content={
          <span className="flex items-center gap-2">
            Search commands{" "}
            <kbd className="rounded border border-white/20 px-1 font-sans text-[10px]">⌘K</kbd>
          </span>
        }
      >
        <Button size="sm" variant="outline">
          Rich content
        </Button>
      </Tooltip>
      <Tooltip text="This trigger stays put." disabled>
        <Button size="sm" variant="ghost">
          Disabled
        </Button>
      </Tooltip>
    </div>
  );
}

export function TooltipBareDemo() {
  return (
    <Tooltip
      bare
      content={
        <div className="tooltip-preview">
          <span>Preview</span>
        </div>
      }
    >
      <Button size="sm" variant="outline">
        Hover for preview
      </Button>
    </Tooltip>
  );
}
