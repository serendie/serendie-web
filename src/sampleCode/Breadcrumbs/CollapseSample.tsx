import { BreadcrumbItem, Breadcrumbs } from "@serendie/ui";
import { SerendieSymbolArticle, SerendieSymbolHome } from "@serendie/symbols";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function CollapseSample() {
  return (
    <Dl>
      <Dt>With Ellipsis</Dt>
      <Dd>
        <Breadcrumbs maxItems={3}>
          <BreadcrumbItem href="/" icon={<SerendieSymbolHome />}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/category" icon={<SerendieSymbolArticle />}>
            Category
          </BreadcrumbItem>
          <BreadcrumbItem href="/subcategory" icon={<SerendieSymbolArticle />}>
            Subcategory
          </BreadcrumbItem>
          <BreadcrumbItem href="/detail" icon={<SerendieSymbolArticle />}>
            Detail
          </BreadcrumbItem>
          <BreadcrumbItem current icon={<SerendieSymbolArticle />}>
            Current Page
          </BreadcrumbItem>
        </Breadcrumbs>
      </Dd>
    </Dl>
  );
}
