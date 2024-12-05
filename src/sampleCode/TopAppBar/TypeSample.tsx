import { Dd, Dl, Dt } from "@/components/LayoutUtils";
import { IconButton } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { TopAppBar } from "@serendie/ui";

export function TypeSample() {
  return (
    <Dl variant="dim">
      <Dt>Nav Bar</Dt>
      <Dd>
        <TopAppBar
          type="navbar"
          headingIconButton={
            <IconButton
              icon={<SerendieSymbol name="menu" />}
              styleType="ghost"
              shape="rectangle"
            />
          }
          trailingIconButtons={
            <IconButton
              icon={<SerendieSymbol name={"search"} />}
              styleType="ghost"
              shape="rectangle"
            />
          }
        />
      </Dd>

      <Dt>Title Bar (with Trailing Icon)</Dt>
      <Dd>
        <TopAppBar
          type="titleBar"
          title="Page Title"
          trailingIconButtons={
            <IconButton
              icon={<SerendieSymbol name={"add"} />}
              styleType="ghost"
              shape="rectangle"
            />
          }
        />
      </Dd>

      <Dt>Nav Bar + Title Bar</Dt>
      <Dd>
        <TopAppBar
          type="navbar"
          headingIconButton={
            <IconButton
              icon={<SerendieSymbol name="menu" />}
              styleType="ghost"
              shape="rectangle"
            />
          }
          trailingIconButtons={
            <IconButton
              icon={<SerendieSymbol name={"search"} />}
              styleType="ghost"
              shape="rectangle"
            />
          }
        />
        <TopAppBar type="titleBar" title="Page Title" />
      </Dd>

      <Dt>Nav Bar + Title Bar (with Icons)</Dt>
      <Dd>
        <TopAppBar
          type="navbar"
          headingIconButton={
            <IconButton
              icon={<SerendieSymbol name="menu" />}
              styleType="ghost"
              shape="rectangle"
            />
          }
          trailingIconButtons={
            <IconButton
              icon={<SerendieSymbol name={"search"} />}
              styleType="ghost"
              shape="rectangle"
            />
          }
        />
        <TopAppBar
          type="titleBar"
          title="Page Title"
          headingIconButton={
            <IconButton
              icon={<SerendieSymbol name="chevron_left" />}
              styleType="ghost"
              shape="rectangle"
            />
          }
          trailingIconButtons={
            <IconButton
              icon={<SerendieSymbol name={"add"} />}
              styleType="ghost"
              shape="rectangle"
            />
          }
        />
      </Dd>
    </Dl>
  );
}
