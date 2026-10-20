import { TabList, TabPanel, Tabs, TabTrigger } from "@/generated/react/Tabs.tsx";

function PanelText({ children }: { children: string }) {
  return <p className="pt-4 text-sm text-ink-gray-6">{children}</p>;
}

export function TabsUnderlineDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabList>
        <TabTrigger value="overview" label="Overview" />
        <TabTrigger
          value="activity"
          label="Activity"
          suffix={
            <span className="rounded-full bg-surface-gray-3 px-1.5 text-xs text-ink-gray-6">
              12
            </span>
          }
        />
        <TabTrigger value="settings" label="Settings" />
      </TabList>
      <TabPanel value="overview">
        <PanelText>Everything in this workspace at a glance.</PanelText>
      </TabPanel>
      <TabPanel value="activity">
        <PanelText>Recent changes, comments and deployments.</PanelText>
      </TabPanel>
      <TabPanel value="settings">
        <PanelText>Name, members and notification preferences.</PanelText>
      </TabPanel>
    </Tabs>
  );
}

export function TabsSubtleDemo() {
  return (
    <Tabs defaultValue="all" variant="subtle">
      <TabList>
        <TabTrigger value="all" label="All" />
        <TabTrigger value="open" label="Open" />
        <TabTrigger value="closed" label="Closed" />
      </TabList>
      <TabPanel value="all">
        <PanelText>All 24 issues.</PanelText>
      </TabPanel>
      <TabPanel value="open">
        <PanelText>8 issues are still open.</PanelText>
      </TabPanel>
      <TabPanel value="closed">
        <PanelText>16 issues have been closed.</PanelText>
      </TabPanel>
    </Tabs>
  );
}

export function TabsGhostDemo() {
  return (
    <Tabs defaultValue="day" variant="ghost">
      <TabList>
        <TabTrigger value="day" label="Day" />
        <TabTrigger value="week" label="Week" />
        <TabTrigger value="month" label="Month" />
      </TabList>
      <TabPanel value="day">
        <PanelText>Today's schedule.</PanelText>
      </TabPanel>
      <TabPanel value="week">
        <PanelText>This week's schedule.</PanelText>
      </TabPanel>
      <TabPanel value="month">
        <PanelText>This month's schedule.</PanelText>
      </TabPanel>
    </Tabs>
  );
}

export function TabsBrowserDemo() {
  return (
    <Tabs defaultValue="inbox" variant="browser-tab" className="w-full min-w-[320px]">
      <TabList>
        <TabTrigger value="inbox" label="Inbox" />
        <TabTrigger value="drafts" label="Drafts" />
        <TabTrigger value="sent" label="Sent" />
      </TabList>
      <TabPanel
        value="inbox"
        className="rounded-b-(--radius-4) border border-t-0 border-outline-gray-2 p-4"
      >
        <PanelText>Messages from your team.</PanelText>
      </TabPanel>
      <TabPanel
        value="drafts"
        className="rounded-b-(--radius-4) border border-t-0 border-outline-gray-2 p-4"
      >
        <PanelText>Unsent drafts.</PanelText>
      </TabPanel>
      <TabPanel
        value="sent"
        className="rounded-b-(--radius-4) border border-t-0 border-outline-gray-2 p-4"
      >
        <PanelText>Delivered messages.</PanelText>
      </TabPanel>
    </Tabs>
  );
}

export function TabsVerticalDemo() {
  return (
    <Tabs defaultValue="general" vertical>
      <div className="flex gap-6">
        <TabList>
          <TabTrigger value="general" label="General" />
          <TabTrigger value="members" label="Members" />
          <TabTrigger value="billing" label="Billing" />
        </TabList>
        <TabPanel value="general">
          <PanelText>Workspace name and URL.</PanelText>
        </TabPanel>
        <TabPanel value="members">
          <PanelText>People with access.</PanelText>
        </TabPanel>
        <TabPanel value="billing">
          <PanelText>Plan and payment details.</PanelText>
        </TabPanel>
      </div>
    </Tabs>
  );
}
