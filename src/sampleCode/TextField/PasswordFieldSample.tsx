import { PasswordField, TextField } from "@serendie/ui";
import { HBox } from "src/components/LayoutUtils";

export function PasswordFieldSample() {
  return (
    <HBox>
      <PasswordField
        placeholder="パスワードを入力"
        label="パスワード"
        required
      />
    </HBox>
  );
}
