import { Divider } from "@/generated/react/Divider.tsx";

export function DividerToolbarDemo() {
  return (
    <div className="divider-toolbar">
      <span>Overview</span>
      <Divider orientation="vertical" flexItem />
      <span>Activity</span>
      <Divider orientation="vertical" flexItem />
      <span>Settings</span>
    </div>
  );
}

export function DividerActionDemo() {
  return (
    <div className="divider-action-stack">
      <Divider action={{ label: "Load more" }} />
      <Divider align="start" action={{ label: "Show older" }} />
      <Divider align="end" action={{ label: "View archive" }} />
    </div>
  );
}
