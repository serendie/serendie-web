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

      <Dt>Heading Element</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            headingElement={<SerendieSymbol name={"placeholder"} />}
          />
        </List>
      </Dd>

      <Dt>Multiple Lines</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            description="補足テキスト"
            headingElement={<SerendieSymbol name={"placeholder"} />}
          />
        </List>
      </Dd>

      <Dt>SubDescription</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            description="補足テキスト"
            subDescription="10分前"
            headingElement={<SerendieSymbol name={"placeholder"} />}
          />
        </List>
      </Dd>

      <Dt>Large Heading Element</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            description="補足テキスト"
            headingElement={<SerendieSymbol name={"placeholder"} />}
            isLargeHeadingElement
          />
        </List>
      </Dd>

      <Dt>Trailing Element</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            trailingElement={<SerendieSymbol name={"chevron-right"} />}
          />
        </List>
      </Dd>

      <Dt>With Badge</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            description="補足テキスト"
            headingElement={<SerendieSymbol name={"placeholder"} />}
            isLargeHeadingElement
            badge={3}
          />
        </List>
      </Dd>
    </Dl>
  );
}
