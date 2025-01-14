import { IconButton } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { HBox, VBox } from "src/components/LayoutUtils";

export function ShapeSample() {
  return (
    <HBox>
      <VBox>
        <IconButton shape="circle" icon={<SerendieSymbol name={"plus"} />} />
        <p>Circle</p>
      </VBox>
      <VBox>
        <IconButton
          shape="rectangle"
          styleType="outlined"
          icon={<SerendieSymbol name={"plus"} />}
        />
        <p>Rectangle</p>
      </VBox>
    </HBox>
  );
}
