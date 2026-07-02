import { List, ListItem } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function StateSample() {
  return (
    <Dl>
      <Dt>Enabled</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            headingElement={<SerendieSymbol name={"placeholder"} />}
          />
        </List>
      </Dd>
      <Dt>Focused</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            headingElement={<SerendieSymbol name={"placeholder"} />}
            focusVisible
          />
        </List>
      </Dd>
      <Dt>Disabled</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            headingElement={<SerendieSymbol name={"placeholder"} />}
            disabled
          />
        </List>
      </Dd>
      <Dt>Selected</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            headingElement={<SerendieSymbol name={"placeholder"} />}
            selected
          />
        </List>
      </Dd>
    </Dl>
  );
}
