import { IconButton } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { HBox, VBox } from "src/components/LayoutUtils";

export function TypeSample() {
  return (
    <HBox>
      <VBox>
        <IconButton icon={<SerendieSymbol name={"plus"} />} />
        <p>Filled</p>
      </VBox>
      <VBox>
        <IconButton
          icon={<SerendieSymbol name={"plus"} />}
          styleType="outlined"
        />
        <p>Outlined</p>
      </VBox>
      <VBox>
        <IconButton icon={<SerendieSymbol name={"plus"} />} styleType="ghost" />
        <p>Ghost</p>
      </VBox>
    </HBox>
  );
}
