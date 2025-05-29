import { ChoiceBox } from "@serendie/ui";

export function IndeterminateSample() {
  return <ChoiceBox type="checkbox" value="itemA" indeterminate={true} />;
}
