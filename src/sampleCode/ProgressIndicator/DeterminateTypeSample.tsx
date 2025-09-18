import { ProgressIndicator } from "@serendie/ui";
import { HBox, VBox } from "src/components/LayoutUtils";

export function DeterminateTypeSample() {
  return (
    <HBox w="100%">
      <VBox>
        <ProgressIndicator
          type="linear"
          size="large"
          value={60}
          max={100}
          style={{ width: 280 }}
        />
        <p>Linear (60%)</p>
      </VBox>
      <VBox>
        <ProgressIndicator type="circular" value={60} max={100} size="large" />
        <p>Circular (60%)</p>
      </VBox>
    </HBox>
  );
}
