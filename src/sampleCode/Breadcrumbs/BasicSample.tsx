import { BreadcrumbItem, Breadcrumbs } from "@serendie/ui";
import { SerendieSymbolArticle, SerendieSymbolHome } from "@serendie/symbols";

export function BasicSample() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/" icon={<SerendieSymbolHome />}>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem href="/category" icon={<SerendieSymbolArticle />}>
        Category
      </BreadcrumbItem>
      <BreadcrumbItem href="/subcategory" icon={<SerendieSymbolArticle />}>
        Subcategory
      </BreadcrumbItem>
      <BreadcrumbItem current icon={<SerendieSymbolArticle />}>
        Current Page
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
