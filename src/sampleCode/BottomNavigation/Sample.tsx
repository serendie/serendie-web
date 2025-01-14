import { BottomNavigation, BottomNavigationItem } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";

export function Sample() {
  return (
    <BottomNavigation>
      <BottomNavigationItem
        icon={<SerendieSymbol name="magnifying-glass" />}
        label="検索"
      />
      <BottomNavigationItem
        icon={<SerendieSymbol name="home" />}
        label="ホーム"
        isActive
      />
      <BottomNavigationItem
        icon={<SerendieSymbol name="chat-circle" />}
        label="トーク"
        dot
      />
      <BottomNavigationItem
        icon={<SerendieSymbol name="calendar" />}
        label="カレンダー"
        count={3}
      />
      <BottomNavigationItem
        icon={<SerendieSymbol name="user" />}
        label="アカウント"
        count={100}
      />
    </BottomNavigation>
  );
}
