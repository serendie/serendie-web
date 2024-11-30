import { BottomNavigation, BottomNavigationItem } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";

export function Sample() {
  return (
    <BottomNavigation>
      <BottomNavigationItem
        icon={<SerendieSymbol name="texture" />}
        label="検索"
      />
      <BottomNavigationItem
        icon={<SerendieSymbol name="texture" />}
        label="ホーム"
        isActive
      />
      <BottomNavigationItem
        icon={<SerendieSymbol name="texture" />}
        label="トーク"
        dot
      />
      <BottomNavigationItem
        icon={<SerendieSymbol name="texture" />}
        label="カレンダー"
        count={3}
      />
      <BottomNavigationItem
        icon={<SerendieSymbol name="texture" />}
        label="アカウント"
        count={100}
      />
    </BottomNavigation>
  );
}
