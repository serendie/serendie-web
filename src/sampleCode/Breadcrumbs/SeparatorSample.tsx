import { BreadcrumbItem, Breadcrumbs } from "@serendie/ui";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function SeparatorSample() {
  return (
    <Dl>
      <Dt>Chevron</Dt>
      <Dd>
        <Breadcrumbs separator="chevron">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/category">Category</BreadcrumbItem>
          <BreadcrumbItem current>Current Page</BreadcrumbItem>
        </Breadcrumbs>
      </Dd>
      <Dt>Slash</Dt>
      <Dd>
        <Breadcrumbs separator="slash">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/category">Category</BreadcrumbItem>
          <BreadcrumbItem current>Current Page</BreadcrumbItem>
        </Breadcrumbs>
      </Dd>
    </Dl>
  );
}
