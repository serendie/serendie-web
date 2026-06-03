import { Steps } from "@serendie/ui";
import { VBox } from "src/components/LayoutUtils";

const items = [
  { title: "ステップ1", description: "補足テキスト" },
  { title: "ステップ2", description: "補足テキスト" },
  { title: "ステップ3", description: "補足テキスト" },
];

export function TypeSample() {
  return (
    <VBox w="100%">
      <VBox w="100%">
        <p>Default</p>
        <Steps items={items} direction="horizontal" type="default" step={1} />
      </VBox>
      <VBox w="100%">
        <p>Subtle</p>
        <Steps items={items} direction="horizontal" type="subtle" step={1} />
      </VBox>
    </VBox>
  );
}
