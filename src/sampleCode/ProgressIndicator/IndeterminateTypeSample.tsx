import { ProgressIndicatorIndeterminate } from "@serendie/ui";
import { HBox, VBox } from "src/components/LayoutUtils";

export function IndeterminateTypeSample() {
  return (
    <HBox>
      <VBox>
        <ProgressIndicatorIndeterminate
          type="linear"
          size="large"
          style={{ width: 280 }}
        />
        <p>Linear</p>
      </VBox>
      <VBox>
        <ProgressIndicatorIndeterminate type="circular" size="large" />
        <p>Circular</p>
      </VBox>
    </HBox>
  );
}
