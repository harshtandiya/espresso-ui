import type { LucideIcon } from "lucide-react";
import { FileText, Home, Package } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/generated/react/Breadcrumb.tsx";

const crumbs = [
  { label: "Home", icon: Home, href: "#" },
  { label: "Products", icon: Package, href: "#" },
  { label: "Widgets", icon: Package, href: "#" },
  { label: "Details", icon: FileText },
] as const;

function CrumbIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon aria-hidden="true" />;
}

/** Auto-collapse via maxItems — prefixes carry into the ellipsis menu. */
export function BreadcrumbMaxItemsDemo() {
  return (
    <Breadcrumb maxItems={3} separator="chevron">
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <BreadcrumbItem key={crumb.label}>
              {isLast ? (
                <BreadcrumbPage prefix={<CrumbIcon icon={crumb.icon} />}>
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={"href" in crumb ? crumb.href : "#"}
                  prefix={<CrumbIcon icon={crumb.icon} />}
                >
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
