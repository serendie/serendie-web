import { TextArea } from "@serendie/ui";

export function AutoAdjustHeightSample() {
  return (
    <TextArea
      description="入力方法などに関するヘルプテキスト"
      invalidMessage="入力の誤りに関するテキスト"
      label="ラベル"
      placeholder="プレースホルダー"
      required
      autoAdjustHeight={true}
    />
  );
}
