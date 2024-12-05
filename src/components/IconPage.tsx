import { List, ListItem, Search, Switch, Toast, toaster } from "@serendie/ui";
import { styled } from "styled-system/jsx";

import { useState } from "react";
import { css, sva } from "styled-system/css";
import {
  SerendieSymbol,
  symbolNames,
  type SymbolVariant,
} from "@serendie/symbols";
import { Menu } from "@ark-ui/react";

const Container = styled("div", {
  base: {
    gridColumn: "1 / -1",
    mb: "128px",
  },
});

const SearchBar = styled("nav", {
  base: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "flex-start",
    mb: "32px",
    expanded: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
});

const IconContainer = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "24px",
    sm: {
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    },
  },
});

const IconBox = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
    height: "110px",
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    borderBottom: "1px solid",
    borderColor: "sd.system.color.component.outline",
    cursor: "pointer",
  },
});

const IconBoxSvg = styled("div", {
  base: {
    width: "24px",
    margin: "auto",
  },
});

const IconTitle = styled("h4", {
  base: {
    margin: 0,
    fontFamily: "Noto Sans Mono",
    textStyle: "sd.system.typography.body.medium_compact",
    expanded: {
      textStyle: "sd.system.typography.body.medium_expanded",
    },
  },
});

export const IconPage: React.FC = () => {
  const [variant, setVariant] = useState<SymbolVariant>("outlined");
  const [searchText, setSearchText] = useState("");

  return (
    <Container>
      <SearchBar>
        <Search
          items={[]} // IconContainer側で表示されるため候補は無しに
          onInputValueChange={(e) => {
            setSearchText(e.inputValue.toLowerCase());
          }}
          placeholder="アイコン名を入力..."
        />
        <Switch
          label={"Filled"}
          className={css({
            paddingLeft: 0,
            "&>div": {
              width: "fit-content",
            },
          })}
          checked={variant === "filled"}
          onCheckedChange={() => {
            setVariant(variant === "outlined" ? "filled" : "outlined");
          }}
        />
      </SearchBar>

      <IconContainer>
        {symbolNames
          .filter((icon) => icon.includes(searchText))
          .map((icon) => (
            <IconMenu key={icon} name={icon} variant={variant}>
              <IconBoxSvg>
                <SerendieSymbol name={icon} size={24} variant={variant} />
              </IconBoxSvg>
              <IconTitle>{icon}</IconTitle>
            </IconMenu>
          ))}
      </IconContainer>

      <Toast toaster={toaster} />
    </Container>
  );
};

const iconMenuStyles = sva({
  slots: ["content", "label"],
  base: {
    content: {
      bgColor: "sd.system.color.component.surface",
      borderRadius: "sd.system.dimension.radius.medium",
      bg: "sd.system.color.component.surface",
      boxShadow: "sd.system.elevation.shadow.level1",
      outline: "none",
      minWidth: "200px",
      y: "calc(var(--cursor-y) + 8px)",
    },
  },
});

const IconMenu: React.FC<{
  children: React.ReactNode;
  name: string;
  variant?: "outlined" | "filled";
}> = ({ children, name, variant }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const styles = iconMenuStyles();
  return (
    <Menu.Root
      positioning={{
        overlap: true,
        offset: {
          mainAxis: position.y - size.height,
          crossAxis: position.x,
        },
        placement: "bottom-start",
      }}
    >
      <Menu.Trigger>
        <IconBox
          onClick={(e) => {
            // boxの中からどの位置をクリックしたかを取得
            const rect = e.currentTarget.getBoundingClientRect();
            setSize({
              width: rect.width,
              height: rect.height,
            });
            setPosition({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
        >
          {children}
        </IconBox>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content className={styles.content}>
          <List>
            <Menu.Item
              value="copy_name"
              onClick={() => {
                navigator.clipboard.writeText(name);
                toaster.create({
                  type: "success",
                  title: name + "のアイコン名をコピーしました",
                  duration: 1500,
                });
              }}
            >
              <ListItem title="アイコン名をコピー" />
            </Menu.Item>
            <Menu.Item
              value="copy_jsx"
              onClick={() => {
                navigator.clipboard.writeText(
                  `<SerendieSymbol name="${name}" variant="${variant}" />`
                );
                toaster.create({
                  type: "success",
                  title: name + "のJSXをコピーしました",
                  duration: 1500,
                });
              }}
            >
              <ListItem title="JSXをコピー" />
            </Menu.Item>
            <Menu.Item
              value="copy_import"
              onClick={() => {
                navigator.clipboard.writeText(
                  `import { SerendieSymbol } from "@serendie/symbols";`
                );
                toaster.create({
                  type: "success",
                  title: "import文をコピーしました",
                  duration: 1500,
                });
              }}
            >
              <ListItem title="import文をコピー" />
            </Menu.Item>
          </List>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
