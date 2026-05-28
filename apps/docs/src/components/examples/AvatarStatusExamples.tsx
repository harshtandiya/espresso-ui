import type { ReactNode } from "react";
import { Circle, CircleDashed, Moon, Pin } from "lucide-react";
import { cn } from "@/lib/utils";

type AvatarStatusBadgeProps = {
  className?: string;
  children: ReactNode;
};

function AvatarStatusBadge({ className, children }: AvatarStatusBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute bottom-0 right-0 flex size-2.5 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full bg-(--color-background) [box-shadow:0_0_0_2px_var(--color-background)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LiveStatus() {
  return (
    <AvatarStatusBadge>
      <Circle
        className="size-1.5 fill-(--color-success) text-(--color-success)"
        aria-hidden="true"
      />
    </AvatarStatusBadge>
  );
}

export function AwayStatus() {
  return (
    <AvatarStatusBadge>
      <CircleDashed className="size-1.5 text-(--color-muted-foreground)" aria-hidden="true" />
    </AvatarStatusBadge>
  );
}

export function SleepStatus() {
  return (
    <AvatarStatusBadge>
      <Moon className="size-1.5 text-(--color-ink-4)" aria-hidden="true" />
    </AvatarStatusBadge>
  );
}

export function PinStatus() {
  return (
    <AvatarStatusBadge>
      <Pin
        className="size-1.5 fill-none text-(--color-muted-foreground)"
        strokeWidth={2}
        aria-hidden="true"
      />
    </AvatarStatusBadge>
  );
}

export function PinnedStatus() {
  return (
    <AvatarStatusBadge className="bg-(--color-info)">
      <Pin
        className="size-1.5 -rotate-12 text-(--color-info-foreground)"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </AvatarStatusBadge>
  );
}
