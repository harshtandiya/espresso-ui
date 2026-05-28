import { Circle, CircleDashed, Moon, Pin } from "lucide-react";

export function LiveStatusIcon() {
  return (
    <Circle
      className="size-(--avatar-status-icon-size) fill-(--color-success) text-(--color-success)"
      aria-hidden="true"
    />
  );
}

export function AwayStatusIcon() {
  return (
    <CircleDashed
      className="size-(--avatar-status-icon-size) text-(--color-muted-foreground)"
      aria-hidden="true"
    />
  );
}

export function SleepStatusIcon() {
  return (
    <Moon className="size-(--avatar-status-icon-size) text-(--color-ink-4)" aria-hidden="true" />
  );
}

export function PinStatusIcon() {
  return (
    <Pin
      className="size-(--avatar-status-icon-size) fill-none text-(--color-muted-foreground)"
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}

export function PinnedStatusIcon() {
  return (
    <Pin
      className="size-(--avatar-status-icon-size) -rotate-12 text-(--color-info-foreground)"
      strokeWidth={2.5}
      aria-hidden="true"
    />
  );
}
