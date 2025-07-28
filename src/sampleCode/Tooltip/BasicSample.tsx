import { Tooltip, Button, IconButton } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { HBox } from "src/components/LayoutUtils";

export function BasicSample() {
  return (
    <HBox alignItems="center">
      <Tooltip content="削除ボタンです。この操作は取り消せません。">
        <Button>削除</Button>
      </Tooltip>

      <Tooltip content="編集ボタンです">
        <Button styleType="outlined">編集</Button>
      </Tooltip>

      <Tooltip content="詳細情報を表示します">
        <IconButton
          icon={<SerendieSymbol name="information" />}
          styleType="ghost"
          size="small"
          shape="circle"
        />
      </Tooltip>
    </HBox>
  );
}
