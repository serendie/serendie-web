import { Steps } from "@serendie/ui";
import { css } from "styled-system/css";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

const items = [
  { title: "ステップ1", description: "補足テキスト" },
  { title: "ステップ2", description: "補足テキスト" },
  { title: "ステップ3", description: "補足テキスト" },
];

export function DirectionSample() {
  return (
    <Dl>
      <Dt>Horizontal</Dt>
      <Dd>
        <Steps
          items={items}
          direction="horizontal"
          type="default"
          step={1}
          className={css({ width: "100%" })}
        />
      </Dd>
      <Dt>Vertical</Dt>
      <Dd>
        <Steps
          items={items}
          direction="vertical"
          type="default"
          step={1}
          className={css({ width: "100%" })}
        />
      </Dd>
    </Dl>
  );
}
