import { useState } from "react";
import { Slider } from "@/generated/react/Slider.tsx";

export function SliderBasicDemo() {
  const [value, setValue] = useState<number[]>([40]);

  return (
    <Slider
      value={value}
      onValueChange={setValue}
      label="Volume"
      description={`${value[0]}% of maximum`}
    />
  );
}

export function SliderRangeDemo() {
  const [value, setValue] = useState<number[]>([20, 80]);

  return (
    <Slider
      className="min-w-[280px]"
      value={value}
      onValueChange={setValue}
      label="Price range"
      description={`$${value[0]} to $${value[1]}`}
    />
  );
}

export function SliderNegativeDemo() {
  const [value, setValue] = useState<number[]>([10]);

  return (
    <Slider
      min={-50}
      max={50}
      value={value}
      onValueChange={setValue}
      label="Exposure"
      description={`${value[0]} EV, filled from zero`}
    />
  );
}

export function SliderSizesDemo() {
  return (
    <div className="slider-demo-stack">
      <Slider size="sm" defaultValue={[30]} label="Small" />
      <Slider size="md" defaultValue={[70]} label="Medium" />
      <Slider defaultValue={[25]} disabled label="Disabled" />
    </div>
  );
}
