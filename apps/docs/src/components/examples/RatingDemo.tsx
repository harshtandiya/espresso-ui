import { useState } from "react";
import { Rating } from "@/generated/react/Rating.tsx";

export function RatingBasicDemo() {
  const [value, setValue] = useState(4);

  return (
    <Rating
      value={value}
      onValueChange={setValue}
      label="Rating"
      description={`${value} of 5 stars`}
    />
  );
}

export function RatingHalfDemo() {
  return (
    <Rating
      defaultValue={3.5}
      step={0.5}
      label="Half stars"
      description="Click the left half of a star for a half value."
    />
  );
}

export function RatingSizesDemo() {
  return (
    <div className="rating-demo-stack">
      <Rating size="xs" defaultValue={3} label="Extra small" />
      <Rating size="sm" defaultValue={3} label="Small" />
      <Rating size="md" defaultValue={3} label="Medium" />
      <Rating size="lg" defaultValue={3} label="Large" />
    </div>
  );
}

export function RatingCustomIconDemo() {
  return (
    <div className="rating-demo-stack">
      <Rating
        defaultValue={4}
        max={6}
        icon={<span className="text-base leading-none">♥</span>}
        label="Custom icon"
        description="Six hearts, no stars."
      />
      <Rating defaultValue={2} disabled label="Disabled" description="Read only." />
    </div>
  );
}

export function RatingErrorDemo() {
  return (
    <Rating
      label="Rating"
      required
      error={["Choose at least one star.", "You can change it later."]}
    />
  );
}
