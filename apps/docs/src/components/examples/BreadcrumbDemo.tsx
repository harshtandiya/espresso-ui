import type { LucideIcon } from "lucide-react";
import { FileText, FolderOpen, Home, Package } from "lucide-react";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/generated/react/Breadcrumb.tsx";

type BreadcrumbDemoProps = {
  size?: "sm" | "md";
  separator?: "slash" | "chevron";
  /** When set, renders enough items to demonstrate maxItems collapse (or no collapse). */
  maxItems?: number;
  itemCount?: number;
  itemsBeforeCollapse?: number;
  prefix?: boolean;
};

const crumbs = [
  { label: "Discover", icon: Home, href: "#" },
  { label: "Products", icon: Package, href: "#" },
  { label: "Category", icon: FolderOpen, href: "#" },
  { label: "Subcategory", icon: FolderOpen, href: "#" },
  { label: "Item", icon: Package, href: "#" },
  { label: "Current", icon: FileText },
] as const;

function PrefixIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon aria-hidden="true" />;
}

function renderItems(items: (typeof crumbs)[number][], prefix: boolean, withSeparators: boolean) {
  return items.map((crumb, index) => {
    const isLast = index === items.length - 1;
    const prefixNode = prefix ? <PrefixIcon icon={crumb.icon} /> : undefined;
    const node = isLast ? (
      <BreadcrumbItem key={crumb.label}>
        <BreadcrumbPage prefix={prefixNode}>{crumb.label}</BreadcrumbPage>
      </BreadcrumbItem>
    ) : (
      <BreadcrumbItem key={crumb.label}>
        <BreadcrumbLink href={"href" in crumb ? crumb.href : "#"} prefix={prefixNode}>
          {crumb.label}
        </BreadcrumbLink>
      </BreadcrumbItem>
    );

    if (!withSeparators) return node;

    return (
      <Fragment key={crumb.label}>
        {node}
        {!isLast ? <BreadcrumbSeparator /> : null}
      </Fragment>
    );
  });
}

export function BreadcrumbDemo({
  size = "md",
  separator = "slash",
  maxItems,
  itemCount = 4,
  itemsBeforeCollapse,
  prefix = false,
}: BreadcrumbDemoProps) {
  const items = crumbs.slice(0, itemCount);
  const collapses = maxItems != null && items.length > maxItems;

  return (
    <Breadcrumb
      size={size}
      separator={separator}
      maxItems={maxItems}
      itemsBeforeCollapse={itemsBeforeCollapse}
    >
      <BreadcrumbList className={prefix ? "flex-nowrap" : undefined}>
        {renderItems(items, prefix, !collapses)}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
