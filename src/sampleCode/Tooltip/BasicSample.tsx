import { Tooltip, Button, IconButton } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { HBox } from "src/components/LayoutUtils";
import { styled } from "styled-system/jsx";

const Span = styled("span", {
  base: {
    width: 'fit-content',
  },
});

export function BasicSample() {
  return (
    <HBox alignItems="center">
      <Tooltip content="削除ボタンです。この操作は取り消せません。">
        <Span><Button>削除</Button></Span>
      </Tooltip>

      <Tooltip content="編集ボタンです">
        <Span><Button styleType="outlined">編集</Button></Span>
      </Tooltip>

      <Tooltip content="詳細情報を表示します">
        <Span>
          <IconButton
            icon={<SerendieSymbol name="information" />}
            styleType="ghost"
            size="small"
            shape="circle"
          />
        </Span>
      </Tooltip>
    </HBox>
  );
}
