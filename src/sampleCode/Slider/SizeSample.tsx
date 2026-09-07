import { Slider } from "@serendie/ui";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function SizeSample() {
  return (
    <Dl>
      <Dt>Medium</Dt>
      <Dd>
        <Slider
          startLabel="Value"
          endLabel="Value"
          defaultValue={[50]}
          min={0}
          max={100}
        />
      </Dd>
      <Dt>Large</Dt>
      <Dd>
        <Slider
          size="large"
          startLabel="Value"
          endLabel="Value"
          defaultValue={[50]}
          min={0}
          max={100}
        />
      </Dd>
    </Dl>
  );
}
