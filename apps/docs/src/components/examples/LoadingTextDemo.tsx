import { LoadingText } from "@/generated/react/LoadingText.tsx";

export function LoadingTextDemo() {
  return (
    <div className="shortcut-demo-stack">
      <LoadingText />
      <LoadingText text="Fetching results…" />
      <LoadingText text="Saving changes…" />
    </div>
  );
}
