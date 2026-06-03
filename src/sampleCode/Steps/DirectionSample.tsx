import { Steps } from "@serendie/ui";
import { VBox } from "src/components/LayoutUtils";

const items = [
  { title: "ステップ1", description: "補足テキスト" },
  { title: "ステップ2", description: "補足テキスト" },
  { title: "ステップ3", description: "補足テキスト" },
];

export function DirectionSample() {
  return (
    <VBox w="100%">
      <VBox w="100%">
        <p>Horizontal</p>
        <Steps items={items} direction="horizontal" type="default" step={1} />
      </VBox>
      <VBox w="100%">
        <p>Vertical</p>
        <Steps items={items} direction="vertical" type="default" step={1} />
      </VBox>
    </VBox>
  );
}
