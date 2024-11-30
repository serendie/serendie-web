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
    },
    label: {
      textStyle: {
        base: "sd.system.typography.label.medium_compact",
        expanded: "sd.system.typography.label.medium_expanded",
      },
      fontFamily: "Noto Sans Mono",
      px: "16px",
      pt: "10px",
      pb: "4px",
      // 1 line
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
});

const IconMenu: React.FC<{
  children: React.ReactNode;
  name: string;
  variant?: "outlined" | "filled";
}> = ({ children, name, variant }) => {
  const styles = iconMenuStyles();
  return (
    <Menu.Root>
      <Menu.Trigger>
        <IconBox>{children}</IconBox>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content className={styles.content}>
          <List>
            <h2 className={styles.label}>{name}</h2>
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
