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
            leftIcon={<SerendieSymbol name={"texture"} />}
          />
        </List>
      </Dd>
      <Dt>Focused</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            leftIcon={<SerendieSymbol name={"texture"} />}
            focusVisible
          />
        </List>
      </Dd>
      <Dt>Disabled</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            leftIcon={<SerendieSymbol name={"texture"} />}
            disabled
          />
        </List>
      </Dd>
      <Dt>Selected</Dt>
      <Dd>
        <List>
          <ListItem
            title="リストタイトル"
            leftIcon={<SerendieSymbol name={"texture"} />}
            selected
          />
        </List>
      </Dd>
    </Dl>
  );
}
