import { IconButton } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { HBox, VBox } from "src/components/LayoutUtils";

export function SizeSample() {
  return (
    <HBox>
      <VBox>
        <IconButton icon={<SerendieSymbol name={"add"} />} size="small" />
        <p>Small</p>
      </VBox>
      <VBox>
        <IconButton icon={<SerendieSymbol name={"add"} />} />
        <p>Medium</p>
      </VBox>
      <VBox>
        <IconButton icon={<SerendieSymbol name={"add"} />} size="large" />
        <p>Large</p>
      </VBox>
    </HBox>
  );
}
