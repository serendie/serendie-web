import { List, ListItem } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function TypeSample() {
  return (
    <Dl variant="dim">
      <Dt>Title Only</Dt>
      <Dd>
        <List>
          <ListItem title="リストタイトル" />
        </List>
      </Dd>

      <Dt>Left Icon</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            leftIcon={<SerendieSymbol name={"placeholder"} />}
          />
        </List>
      </Dd>

      <Dt>Multiple Lines</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            description="補足テキスト"
            leftIcon={<SerendieSymbol name={"placeholder"} />}
          >
            <p>タイムスタンプなど</p>
          </ListItem>
        </List>
      </Dd>

      <Dt>Large Left Icon</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            leftIcon={<SerendieSymbol name={"placeholder"} />}
            isLargeLeftIcon
          />
        </List>
      </Dd>

      <Dt>Multiple Lines</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            description="補足テキスト"
            leftIcon={<SerendieSymbol name={"placeholder"} />}
            isLargeLeftIcon
          >
            <p>タイムスタンプなど</p>
          </ListItem>
        </List>
      </Dd>

      <Dt>Right Icon</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            rightIcon={<SerendieSymbol name={"chevron-right"} />}
          />
        </List>
      </Dd>

      <Dt>Multiple Lines</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            description="補足テキスト"
            rightIcon={<SerendieSymbol name={"chevron-right"} />}
          />
        </List>
      </Dd>

      <Dt>With Badge</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            description="補足テキスト"
            leftIcon={<SerendieSymbol name={"placeholder"} />}
            isLargeLeftIcon
            badge={3}
          />
        </List>
      </Dd>
    </Dl>
  );
}
