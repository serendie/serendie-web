import { ProgressIndicatorIndeterminate } from "@serendie/ui";
import { HBox, VBox } from "src/components/LayoutUtils";

export function IndeterminateColorSample() {
  return (
    <>
      <HBox>
        <VBox>
          <ProgressIndicatorIndeterminate
            type="circular"
            color="primary"
            size="large"
          />
          <p>Circular / Primary</p>
        </VBox>
        <VBox>
          <ProgressIndicatorIndeterminate
            type="circular"
            color="subtle"
            size="large"
          />
          <p>Circular / Subtle</p>
        </VBox>
      </HBox>
    </>
  );
}
