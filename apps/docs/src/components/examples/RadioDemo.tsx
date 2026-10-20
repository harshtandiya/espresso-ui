import { Radio } from "@/generated/react/Radio.tsx";
import { RadioGroup } from "@/generated/react/RadioGroup.tsx";

export function RadioPreviewDemo() {
  return (
    <RadioGroup label="Choose a plan" defaultValue="pro" description="You can change this later.">
      <Radio value="free" label="Free" description="For personal projects." />
      <Radio value="pro" label="Pro" description="For growing teams." />
      <Radio value="enterprise" label="Enterprise" description="Advanced controls and support." />
    </RadioGroup>
  );
}

export function RadioSizesDemo() {
  return (
    <div className="radio-demo-stack">
      <RadioGroup label="Extra small" size="xs" defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
      <RadioGroup label="Small" size="sm" defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
      <RadioGroup label="Medium" size="md" defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    </div>
  );
}

export function RadioPaddedDemo() {
  return (
    <RadioGroup label="Notifications" defaultValue="updates" padded>
      <Radio value="updates" label="Product updates" description="New features and improvements." />
      <Radio
        value="security"
        label="Security alerts"
        description="Sign-ins and password changes."
      />
      <Radio value="off" label="Nothing" description="Only critical account messages." disabled />
    </RadioGroup>
  );
}

export function RadioStatesDemo() {
  return (
    <div className="radio-demo-stack">
      <RadioGroup label="Default" defaultValue="a">
        <Radio value="a" label="Selected option" />
        <Radio value="b" label="Unselected option" />
      </RadioGroup>
      <RadioGroup label="Disabled" defaultValue="a" disabled>
        <Radio value="a" label="Selected option" />
        <Radio value="b" label="Unselected option" />
      </RadioGroup>
      <RadioGroup label="With error" required error="Choose an option to continue.">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    </div>
  );
}

export function RadioHorizontalDemo() {
  return (
    <RadioGroup label="Workspace visibility" orientation="horizontal" defaultValue="team">
      <Radio value="private" label="Private" />
      <Radio value="team" label="Team" />
      <Radio value="public" label="Public" />
    </RadioGroup>
  );
}
