import { HBox, VBox } from "@/components/LayoutUtils";
import { BottomNavigationItem } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";

export function ItemSample() {
  return (
    <HBox>
      <VBox w="25%">
        <BottomNavigationItem
          label="ホーム"
          icon={<SerendieSymbol name={"texture"} />}
        />
        <p>Default (Enable)</p>
      </VBox>
      <VBox w="25%">
        <BottomNavigationItem
          label="ホーム"
          icon={<SerendieSymbol name={"texture"} />}
          isActive
        />
        <p>Active</p>
      </VBox>
      <VBox w="25%">
        <BottomNavigationItem
          label="ホーム"
          icon={<SerendieSymbol name={"texture"} />}
          dot
        />
        <p>With Badge (dot)</p>
      </VBox>
      <VBox w="25%">
        <BottomNavigationItem
          label="ホーム"
          icon={<SerendieSymbol name={"texture"} />}
          count={3}
        />
        <p>With Badge (number)</p>
      </VBox>
    </HBox>
  );
}
