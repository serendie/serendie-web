import { Slider } from "@serendie/ui";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function StateSample() {
  return (
    <Dl>
      <Dt>Enabled</Dt>
      <Dd>
        <Slider
          startLabel="Value"
          endLabel="Value"
          defaultValue={[50]}
          min={0}
          max={100}
        />
      </Dd>
      <Dt>Disabled</Dt>
      <Dd>
        <Slider
          startLabel="Value"
          endLabel="Value"
          defaultValue={[50]}
          min={0}
          max={100}
          disabled
        />
      </Dd>
    </Dl>
  );
}
