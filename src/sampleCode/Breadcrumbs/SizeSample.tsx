import { BreadcrumbItem, Breadcrumbs } from "@serendie/ui";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function SizeSample() {
  return (
    <Dl>
      <Dt>Medium</Dt>
      <Dd>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/category">Category</BreadcrumbItem>
          <BreadcrumbItem current>Current Page</BreadcrumbItem>
        </Breadcrumbs>
      </Dd>
      <Dt>Small</Dt>
      <Dd>
        <Breadcrumbs size="small">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/category">Category</BreadcrumbItem>
          <BreadcrumbItem current>Current Page</BreadcrumbItem>
        </Breadcrumbs>
      </Dd>
    </Dl>
  );
}
