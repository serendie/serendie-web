import { Steps } from "@serendie/ui";
import { VBox } from "src/components/LayoutUtils";

const items = [
  { title: "ステップ1", description: "説明テキスト" },
  { title: "ステップ2", description: "説明テキスト" },
  { title: "ステップ3", description: "説明テキスト" },
];

export function TypeSample() {
  return (
    <VBox>
      <VBox>
        <p>Default</p>
        <Steps items={items} direction="horizontal" type="default" step={1} />
      </VBox>
      <VBox>
        <p>Subtle</p>
        <Steps items={items} direction="horizontal" type="subtle" step={1} />
      </VBox>
    </VBox>
  );
}
