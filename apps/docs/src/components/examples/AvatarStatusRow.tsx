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
      <Avatar label="A" size="lg" shape="circle" indicator={<LiveStatusIcon />} />
      <Avatar label="B" size="lg" shape="circle" indicator={<AwayStatusIcon />} />
      <Avatar label="C" size="lg" shape="circle" indicator={<SleepStatusIcon />} />
      <Avatar
        label="D"
        size="lg"
        shape="circle"
        indicator={<PinnedStatusIcon />}
        statusClassName="bg-surface-blue-6"
      />
      <Avatar label="E" size="lg" shape="circle" indicator={<PinStatusIcon />} />
    </>
  );
}
