import { Badge } from "@/generated/react/Badge.tsx";
import { ChevronDown, Sparkles } from "lucide-react";

export function BadgeWithIcons() {
  return (
    <>
      <Badge theme="green" variant="subtle" prefix={<Sparkles aria-hidden="true" />}>
        Prefix
      </Badge>
      <Badge
        theme="blue"
        variant="outline"
        prefix={<Sparkles aria-hidden="true" />}
        suffix={<ChevronDown aria-hidden="true" />}
      >
        Both
      </Badge>
      <Badge theme="amber" variant="solid" suffix={<ChevronDown aria-hidden="true" />}>
        Suffix
      </Badge>
    </>
  );
}
