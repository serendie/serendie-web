import { Steps } from "@serendie/ui";
import { VBox } from "src/components/LayoutUtils";

const items = [
  { title: "ステップ1", description: "説明テキスト" },
  { title: "ステップ2", description: "説明テキスト" },
  { title: "ステップ3", description: "説明テキスト" },
];

export function DirectionSample() {
  return (
    <VBox>
      <Steps items={items} direction="horizontal" type="default" step={1} />
      <Steps items={items} direction="vertical" type="default" step={1} />
    </VBox>
  );
}
