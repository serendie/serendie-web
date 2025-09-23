import { ProgressIndicator } from "@serendie/ui";
import { css } from "styled-system/css";
import { HBox, VBox } from "src/components/LayoutUtils";

export function SizeSample() {
  return (
    <>
      <HBox>
        <VBox>
          <ProgressIndicator
            type="circular"
            size="small"
            value={30}
            max={100}
          />
          <p>Small (Circular)</p>
        </VBox>
        <VBox>
          <ProgressIndicator
            type="circular"
            size="medium"
            value={60}
            max={100}
          />
          <p>Medium (Circular)</p>
        </VBox>
        <VBox>
          <ProgressIndicator
            type="circular"
            size="large"
            value={90}
            max={100}
          />
          <p>Large (Circular)</p>
        </VBox>
      </HBox>
      <HBox mt="sd.system.dimension.spacing.extraLarge">
        <VBox>
          <ProgressIndicator
            type="linear"
            size="medium"
            value={60}
            max={100}
            className={css({ width: "200px" })}
          />
          <p>Medium (Linear)</p>
        </VBox>
        <VBox>
          <ProgressIndicator
            type="linear"
            size="large"
            value={90}
            max={100}
            className={css({ width: "200px" })}
          />
          <p>Large (Linear)</p>
        </VBox>
      </HBox>
    </>
  );
}
