import { Button } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { HBox } from "src/components/LayoutUtils";

export function IconSample() {
  return (
    <HBox>
      <Button leftIcon={<SerendieSymbol name="chevron_left" />}>
        LeftIcon
      </Button>
      <Button
        rightIcon={<SerendieSymbol name="chevron_right" />}
        styleType="ghost"
      >
        RightIcon
      </Button>
    </HBox>
  );
}
