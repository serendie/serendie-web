import { IconButton } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import type { ComponentProps } from "react";
import { StateMatrix } from "src/components/StateMatrix";

export const StateSample: React.FC = () => {
  return (
    <StateMatrix<ComponentProps<typeof IconButton>>
      component={IconButton}
      defaultProps={{ icon: <SerendieSymbol name={"plus"} /> }}
      propsName="styleType"
      states={["enabled", "hover", "focus-visible", "disabled"]}
      props={["filled", "ghost", "outlined"]}
    />
  );
};
