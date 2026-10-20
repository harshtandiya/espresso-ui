import { useState } from "react";
import { Alert } from "@/generated/react/Alert.tsx";
import { Button } from "@/generated/react/Button.tsx";
import { Spinner } from "@/generated/react/Spinner.tsx";

export function AlertRowsDemo() {
  return (
    <div className="alert-demo-stack">
      <Alert title="Your changes are saved." theme="green" />
      <Alert
        title="This workspace is read-only."
        theme="amber"
        primaryAction={{ label: "Request access" }}
      />
      <Alert
        title="Sync failed. Retry in a moment."
        theme="red"
        primaryAction={{ label: "Retry" }}
      />
      <Alert
        title="A new version is available."
        theme="blue"
        primaryAction={{ label: "Refresh" }}
      />
      <Alert title="No icon, just a message." icon={false} />
    </div>
  );
}

export function AlertBannerDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button size="sm" variant="outline" onClick={() => setVisible(true)}>
        Show banner again
      </Button>
    );
  }

  return (
    <Alert
      title="Your trial ends in 3 days"
      description="Add a payment method to keep your workspace and all of its data."
      theme="amber"
      dismissible
      onDismiss={() => setVisible(false)}
      primaryAction={{ label: "Upgrade plan" }}
      secondaryAction={{
        label: "Remind me",
        onClick: ({ dismiss }) => {
          dismiss();
          setVisible(false);
        },
      }}
    />
  );
}

export function AlertCustomIconDemo() {
  return (
    <div className="alert-demo-stack">
      <Alert
        title="Importing contacts…"
        description="You can leave this page while we finish."
        icon={<Spinner size="sm" />}
      />
      <Alert title="Icon hidden" description="The message carries the meaning." icon={false} />
    </div>
  );
}
