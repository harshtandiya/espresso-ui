import { FileText, Home, Package } from "lucide-react";
import { Breadcrumb } from "@/generated/react/Breadcrumb.tsx";

const items = [
  { label: "Home", href: "#", prefix: <Home aria-hidden="true" /> },
  { label: "Products", href: "#", prefix: <Package aria-hidden="true" /> },
  { label: "Current page", prefix: <FileText aria-hidden="true" /> },
];

/** The compact frappe-ui v1 API: pass the trail as data. */
export function BreadcrumbItemsDemo() {
  return <Breadcrumb items={items} separator="chevron" />;
}
