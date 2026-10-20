import { useState } from "react";
import { ErrorMessage } from "@/generated/react/ErrorMessage.tsx";
import { Progress } from "@/generated/react/Progress.tsx";
import { Skeleton } from "@/generated/react/Skeleton.tsx";
import { Button } from "@/generated/react/Button.tsx";

const serverError = Object.assign(new Error("Could not save changes."), {
  messages: ["Name is required.", "Choose a workspace."],
});

export function ErrorMessageDemo() {
  return (
    <div className="feedback-demo-stack">
      <ErrorMessage message="Could not save changes." />
      <ErrorMessage message={["Name is required.", "Choose a workspace."]} />
      <ErrorMessage message={serverError} />
    </div>
  );
}

export function SkeletonCardDemo() {
  return (
    <div className="skeleton-card">
      <Skeleton className="h-28 w-full rounded-lg" />
      <div className="skeleton-card-body">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonTextDemo() {
  return (
    <div className="skeleton-text">
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-11/12" />
      <Skeleton className="h-3.5 w-2/3" />
    </div>
  );
}

export function ProgressDemo() {
  const [value, setValue] = useState(64);

  return (
    <div className="progress-demo-stack">
      <Progress value={value} label="Uploading files" hint />
      <Progress value={value} label="Storage used" hint={<span>700 GB of 2 TB</span>} />
      <Progress value={value} label="Onboarding" hint={<span>Step 2 of 3</span>} intervals={3} />
      <div className="progress-demo-actions">
        <Button size="xs" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          Remove 10
        </Button>
        <Button size="xs" variant="outline" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          Add 10
        </Button>
      </div>
    </div>
  );
}
