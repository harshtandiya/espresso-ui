import { Avatar } from "@/generated/react/Avatar.tsx";
import {
  AwayStatusIcon,
  LiveStatusIcon,
  PinStatusIcon,
  PinnedStatusIcon,
  SleepStatusIcon,
} from "@/components/examples/AvatarStatusExamples.tsx";

export function AvatarStatusRow() {
  return (
    <>
      <Avatar fallback="A" size="lg" shape="circle" status={<LiveStatusIcon />} />
      <Avatar fallback="B" size="lg" shape="circle" status={<AwayStatusIcon />} />
      <Avatar fallback="C" size="lg" shape="circle" status={<SleepStatusIcon />} />
      <Avatar
        fallback="D"
        size="lg"
        shape="circle"
        status={<PinnedStatusIcon />}
        statusClassName="bg-(--color-info)"
      />
      <Avatar fallback="E" size="lg" shape="circle" status={<PinStatusIcon />} />
    </>
  );
}
