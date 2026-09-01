import { Slider } from "@serendie/ui";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function MarkerSample() {
  return (
    <Dl>
      <Dt>With Markers</Dt>
      <Dd>
        <Slider
          size="large"
          startLabel="Value"
          endLabel="Value"
          defaultValue={[50]}
          min={0}
          max={100}
          markerValues={[0, 25, 50, 75, 100]}
        />
      </Dd>
      <Dt>Without Markers</Dt>
      <Dd>
        <Slider
          size="medium"
          startLabel="Value"
          endLabel="Value"
          defaultValue={[50]}
          min={0}
          max={100}
          showMarkers={false}
        />
      </Dd>
    </Dl>
  );
}
