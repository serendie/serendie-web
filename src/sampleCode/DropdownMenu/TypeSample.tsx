import { DropdownMenu } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { Dd, Dl, Dt } from "src/components/LayoutUtils";

export function TypeSample() {
  return (
    <Dl>
      <Dt>Default</Dt>
      <Dd>
        <DropdownMenu
          items={[
            {
              label: "React",
              value: "React",
              icon: <SerendieSymbol name="placeholder" />,
            },
            {
              label: "Vue",
              value: "Vue",
              icon: <SerendieSymbol name="placeholder" />,
            },
            {
              label: "Angular",
              value: "Angular",
              icon: <SerendieSymbol name="placeholder" />,
            },
          ]}
          title="メニュータイトル"
        />
      </Dd>

      <Dt>Icon</Dt>
      <Dd>
        <DropdownMenu
          items={[
            {
              label: "React",
              value: "React",
              icon: <SerendieSymbol name="placeholder" />,
            },
            {
              label: "Vue",
              value: "Vue",
              icon: <SerendieSymbol name="placeholder" />,
            },
            {
              label: "Angular",
              value: "Angular",
              icon: <SerendieSymbol name="placeholder" />,
            },
          ]}
          title="メニュータイトル"
          styleType="iconButton"
        />
      </Dd>
    </Dl>
  );
}
