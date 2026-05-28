import { Avatar } from "@/generated/react/Avatar.tsx";
import {
  AwayStatus,
  LiveStatus,
  PinStatus,
  PinnedStatus,
  SleepStatus,
} from "@/components/examples/AvatarStatusExamples.tsx";

export function AvatarStatusRow() {
  return (
    <>
      <Avatar fallback="A" size="lg" shape="circle" status={<LiveStatus />} />
      <Avatar fallback="B" size="lg" shape="circle" status={<AwayStatus />} />
      <Avatar fallback="C" size="lg" shape="circle" status={<SleepStatus />} />
      <Avatar fallback="D" size="lg" shape="circle" status={<PinnedStatus />} />
      <Avatar fallback="E" size="lg" shape="circle" status={<PinStatus />} />
    </>
  );
}
