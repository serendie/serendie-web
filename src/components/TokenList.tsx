import type tokens from "@serendie/design-token/token-list";
import { IconButton, Search } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";
import { css, cva } from "styled-system/css";
import { Box, Circle, Flex, styled } from "styled-system/jsx";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Icon01 from "../assets/headLineIcon/icon01.svg?react";
import Icon02 from "../assets/headLineIcon/icon02.svg?react";
import Icon03 from "../assets/headLineIcon/icon03.svg?react";
import Icon04 from "../assets/headLineIcon/icon04.svg?react";
import Icon05 from "../assets/headLineIcon/icon05.svg?react";
import Icon06 from "../assets/headLineIcon/icon06.svg?react";

const icons = [
  <Icon01 />,
  <Icon02 />,
  <Icon03 />,
  <Icon04 />,
  <Icon05 />,
  <Icon06 />,
];
interface TokenList {
  tokens: typeof tokens;
}

type Tokens = typeof tokens;
type Token = Tokens[number];

const Grid = styled("div");
const Row = styled("div");
const Span = styled("span");
const Wrapper = styled("div", {
  base: {
    display: "contents",
  },
});
const Th = styled("div", {
  base: {
    textAlign: "left",
    color: "sd.reference.color.scale.gray.400",
    py: "sd.system.dimension.spacing.small",
    borderBottom: "1px solid",
    borderColor: "sd.reference.color.scale.gray.200",
    "& span": {
      fontFamily: "var(--global-font-mono)",
    },
  },
});

export function TokenList({ tokens }: TokenList) {
  const [keyword, setKeyword] = useState("");

  const filteredTokens = tokens.filter((token) => {
    return token.key.toLowerCase().includes(keyword.toLowerCase());
  });

  const AllTypes = [...new Set(tokens.map((token) => token.type))];

  const types = [...new Set(filteredTokens.map((token) => token.type))];

  return (
    <div>
      <div
        className={css({
          display: {
            base: "none",
            smDown: "block",
          },
        })}
      >
        <Search
          onInputValueChange={(e) => setKeyword(e.inputValue)}
          placeholder="Search tokens"
          items={[]}
        />
      </div>
      <Grid
        display={"grid"}
        gridTemplateColumns={{
          sm: "repeat(2, 1fr)",
        }}
        mt={{
          base: "sd.system.dimension.spacing.none",
          smDown: "sd.system.dimension.spacing.large",
        }}
        fontSize={"sd.reference.typography.scale.expanded.twoExtraSmall"}
      >
        <Wrapper
          display={{ base: "grid", smDown: "none" }}
          gridTemplateColumns={"subgrid"}
          gridColumn={"1/-1"}
          bgColor={"sd.system.color.component.surface"}
          position={"sticky"}
          top={0}
          alignContent={"center"}
        >
          <Th alignContent={"center"}>
            <span>name</span>
          </Th>
          <Th display={"grid"} gridTemplateColumns={"1fr auto"}>
            <Box alignContent={"center"}>
              <span>reference</span>
            </Box>
            <SearchToken onInputValueChange={(e) => setKeyword(e.inputValue)} />
          </Th>
        </Wrapper>
        {types.map((type, i) => (
          <Wrapper key={i}>
            <h2
              className={css({
                gridColumn: "1 / -1",
                textStyle: {
                  base: "_Web.headline.h1_sp",
                  sm: "sd.system.typography.title.small_compact",
                },
                pt: "sd.system.dimension.spacing.extraLarge",
                pb: "sd.system.dimension.spacing.small",
                color: "web.system.color.component.onSurface",
                display: "flex",
                alignItems: "center",
                gap: "sd.system.dimension.spacing.twoExtraSmall",
                ml: "-sd.system.dimension.spacing.twoExtraSmall",
                "& > svg": {
                  w: "28px",
                },
                "& > svg path": {
                  fill: "sd.reference.color.scale.gray.400",
                },
              })}
              style={{ textTransform: "capitalize" }}
            >
              {icons[AllTypes.indexOf(type) % icons.length]}
              {type}
            </h2>
            <List
              tokens={filteredTokens.filter((token) => token.type === type)}
            />
          </Wrapper>
        ))}
      </Grid>
    </div>
  );
}

interface ListByTYpeProps {
  tokens: Tokens;
}

const List: React.FC<ListByTYpeProps> = ({ tokens }) => {
  return (
    <>
      {tokens.map((token, i) => (
        <Fragment key={i}>
          <Row
            title={token.key}
            pt={{
              base: "sd.system.dimension.spacing.medium",
              sm: "sd.system.dimension.spacing.extraSmall",
            }}
            pb={{
              base: "sd.system.dimension.spacing.large",
              sm: "sd.system.dimension.spacing.small",
            }}
            borderBottom={{ sm: "1px solid" }}
            borderColor={{ sm: "sd.reference.color.scale.gray.200" }}
          >
            <PathSpan path={token.path} />
          </Row>
          <Values token={token} />
        </Fragment>
      ))}
    </>
  );
};

interface ValuesProps {
  token: Token;
}

const Values: React.FC<ValuesProps> = ({ token }) => {
  const { originalValue, value } = token;
  return (
    <Row
      pt={{ sm: "sd.system.dimension.spacing.extraSmall" }}
      pb={{
        base: "sd.system.dimension.spacing.large",
        sm: "sd.system.dimension.spacing.small",
      }}
      borderBottom={"1px solid"}
      borderColor={"sd.reference.color.scale.gray.200"}
    >
      <Flex
        flexDirection={"column"}
        alignItems={"flex-start"}
        gap={"sd.reference.dimension.scale.3"}
      >
        {typeof originalValue === "object" ? (
          Object.keys(originalValue).map((key, i) => (
            <Box
              key={i}
              display="flex"
              alignItems={"center"}
              gap={"sd.reference.dimension.scale.3"}
            >
              <Box color={"sd.system.color.component.onSurfaceVariant"}>
                {key}:{" "}
              </Box>
              <ReferenceValue
                token={token}
                originalValue={originalValue[key].toString()}
                value={
                  typeof value === "object" ? value[key]?.toString() : undefined
                }
              />
            </Box>
          ))
        ) : (
          <ReferenceValue
            token={token}
            originalValue={originalValue.toString()}
            value={token.value.toString()}
          />
        )}
      </Flex>
    </Row>
  );
};

const ReferenceValue: React.FC<{
  token: Token;
  originalValue: string;
  value?: string;
}> = ({ token, originalValue }) => {
  const isRef =
    originalValue.startsWith("{") &&
    originalValue.endsWith("}") &&
    originalValue.includes("reference");

  return (
    <Flex flexDirection="column" alignItems={"flex-start"}>
      {token.type === "color" && (
        <ColorName
          name={isRef ? originalValue.toString() : token.key}
          color={token.value.toString()}
        />
      )}
      <Code lineBreak={"anywhere"}>
        {originalValue.replace(/[(^{)(}$)]/g, "")}
      </Code>
    </Flex>
  );
};

const PathSpan: React.FC<{ path: string[] }> = ({ path }) => {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(path.join("."));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }, [path]);
  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
      cursor={"pointer"}
    >
      <code
        style={{
          lineBreak: "anywhere",
        }}
      >
        {path.map((p, i) => (
          <Span
            key={i}
            color={
              i < path.length - 1
                ? "sd.system.color.component.onSurfaceVariant"
                : "web.system.color.component.onSurface"
            }
          >
            <span>{p}</span>
            {i < path.length - 1 && <span>.</span>}
          </Span>
        ))}
      </code>

      {hover && (
        <Span
          position={"relative"}
          display={"inline-flex"}
          alignItems={"center"}
          pos={"absolute"}
          translate={"5px -25%"}
          fontSize={"sd.reference.typography.scale.twoExtraSmall"}
        >
          <IconButton
            size={"small"}
            styleType="ghost"
            shape="rectangle"
            icon={<SerendieSymbol name="copy" />}
            onClick={handleClick}
          />
          {copied && (
            <Span
              p={"sd.system.dimension.spacing.twoExtraSmall"}
              pl={0}
              bgColor={"sd.reference.color.scale.white.1000"}
              color={"sd.reference.color.scale.gray.800"}
            >
              Copied
            </Span>
          )}
        </Span>
      )}
    </Box>
  );
};

const ColorName: React.FC<{ name: string; color: string }> = ({
  name,
  color,
}) => {
  const slitted = name.replace(/[{}]/g, "").split(".");
  const colorNumber = slitted.pop();
  const colorName = slitted.pop();

  return (
    <Flex
      py="sd.system.dimension.spacing.twoExtraSmall"
      alignItems="center"
      gap="sd.system.dimension.spacing.twoExtraSmall"
    >
      <Circle
        size={16}
        display={"inline-block"}
        outline={"1px solid"}
        style={{
          backgroundColor: color,
          // TODO: ここでtokenのキーを指定するのが難しいので回避策を考える
          outlineColor: color === "#FFFFFF" ? "#CED5D9" : color,
        }}
      />
      <Span>
        <Span
          color="sd.system.color.component.onSurfaceVariant"
          style={{ textTransform: "capitalize" }}
        >
          {colorName}
          <Span p="sd.system.dimension.spacing.twoExtraSmall">/</Span>
        </Span>
        <code
          className={css({
            color: "web.system.color.component.onSurface",
          })}
        >
          {colorNumber}
        </code>
      </Span>
    </Flex>
  );
};

const Code = styled("code", {
  base: {
    borderRadius: "sd.system.dimension.radius.small",
    bg: "sd.reference.color.scale.gray.100",
    py: "sd.system.dimension.spacing.twoExtraSmall",
    px: "sd.system.dimension.spacing.twoExtraSmall",
    color: "sd.system.color.component.onSurfaceVariant",
  },
});

const SearchToken: React.FC<{
  onInputValueChange: (e: { inputValue: string }) => void;
}> = ({ onInputValueChange }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const isMac = navigator.userAgent.toLowerCase().includes("mac os x");

  const keyBindStyles = cva({
    base: {
      aspectRatio: "1/1",
      bg: "sd.reference.color.scale.gray.100",
      borderRadius: "sd.system.dimension.radius.small",
      color: "sd.system.color.component.onSurfaceVariant",
      height: "20px",
      width: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    variants: {
      width: {
        auto: {
          width: "auto",
        },
      },
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        ref.current?.querySelector("input")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <Box ref={ref} position="relative" color="initial">
      <Search
        size="small"
        onInputValueChange={onInputValueChange}
        placeholder="tokenを検索..."
        items={[]}
      />
      <Box
        position="absolute"
        top="50%"
        right="4px"
        transform="translateY(-50%)"
        p="sd.system.dimension.spacing.twoExtraSmall"
        pointerEvents="none"
        display="flex"
        gap={"-sd.system.dimension.spacing.twoExtraSmall"}
        fontFamily="var(--global-font-mono)"
      >
        <code
          className={keyBindStyles({
            width: isMac ? undefined : "auto",
          })}
        >
          {isMac ? "⌘" : "Ctrl"}
        </code>
        +<code className={keyBindStyles()}>K</code>
      </Box>
    </Box>
  );
};
