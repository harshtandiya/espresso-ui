import { useState } from "react";
import { Grid3x3, List } from "lucide-react";
import { TabButtons } from "@/generated/react/TabButtons.tsx";

const PERIODS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function TabButtonsBasicDemo() {
  const [value, setValue] = useState<string | number>("week");

  return <TabButtons options={PERIODS} value={value} onValueChange={setValue} />;
}

export function TabButtonsVariantsDemo() {
  const [subtle, setSubtle] = useState<string | number>("all");
  const [ghost, setGhost] = useState<string | number>("all");
  const [underline, setUnderline] = useState<string | number>("all");
  const [browser, setBrowser] = useState<string | number>("all");

  const options = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
  ];

  return (
    <div className="tab-buttons-demo-stack">
      <TabButtons options={options} value={subtle} onValueChange={setSubtle} variant="subtle" />
      <TabButtons options={options} value={ghost} onValueChange={setGhost} variant="ghost" />
      <TabButtons
        options={options}
        value={underline}
        onValueChange={setUnderline}
        variant="underline"
      />
      <TabButtons
        options={options}
        value={browser}
        onValueChange={setBrowser}
        variant="browser-tab"
      />
    </div>
  );
}

export function TabButtonsIconDemo() {
  const [view, setView] = useState<string | number>("grid");
  const [period, setPeriod] = useState<string | number>("week");

  return (
    <div className="tab-buttons-demo-stack">
      <TabButtons
        options={[
          { value: "grid", label: "Grid view", icon: <Grid3x3 /> },
          { value: "list", label: "List view", icon: <List /> },
        ]}
        value={view}
        onValueChange={setView}
        variant="subtle"
      />
      <TabButtons
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
        value={period}
        onValueChange={setPeriod}
        variant="ghost"
        size="md"
      />
    </div>
  );
}
