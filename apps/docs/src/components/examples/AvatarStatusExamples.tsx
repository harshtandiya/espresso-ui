import { Circle, CircleDashed, Moon, Pin } from "lucide-react";

export function LiveStatusIcon() {
  return (
    <Circle className="size-full fill-surface-green-5 text-surface-green-5" aria-hidden="true" />
  );
}

export function AwayStatusIcon() {
  return <CircleDashed className="size-full text-ink-gray-5" aria-hidden="true" />;
}

export function SleepStatusIcon() {
  return <Moon className="size-full text-ink-gray-4" aria-hidden="true" />;
}

export function PinStatusIcon() {
  return <Pin className="size-full fill-none text-ink-gray-5" strokeWidth={2} aria-hidden="true" />;
}

export function PinnedStatusIcon() {
  return <Pin className="size-full -rotate-12 text-white" strokeWidth={2.5} aria-hidden="true" />;
}
