import { Tooltip, Button } from "@serendie/ui";
import { styled } from "../../../styled-system/jsx";

const Grid = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "6",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "8",
  },
});

const GridItem = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Span = styled("span", {
  base: {
    width: 'fit-content',
  },
});

export function PlacementSample() {
  return (
    <Grid>
      <GridItem>
        <Tooltip content="上開始" placement="top-start">
          <Span>
            <Button size="small" styleType="ghost">
              Top Start
            </Button>
          </Span>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="上" placement="top">
          <Span>
            <Button size="small" styleType="ghost">
              Top
            </Button>
          </Span>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="上終了" placement="top-end">
          <Span>
            <Button size="small" styleType="ghost">
              Top End
            </Button>
          </Span>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="左" placement="left">
          <Span>
            <Button size="small" styleType="ghost">
              Left
            </Button>
          </Span>
        </Tooltip>
      </GridItem>

      <GridItem />

      <GridItem>
        <Tooltip content="右" placement="right">
          <Span>
            <Button size="small" styleType="ghost">
              Right
            </Button>
          </Span>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="下開始" placement="bottom-start">
          <Span>
            <Button size="small" styleType="ghost">
              Bottom Start
            </Button>
          </Span>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="下" placement="bottom">
          <Span>
            <Button size="small" styleType="ghost">
              Bottom
            </Button>
          </Span>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="下終了" placement="bottom-end">
          <Span>
            <Button size="small" styleType="ghost">
              Bottom End
            </Button>
          </Span>
        </Tooltip>
      </GridItem>
    </Grid>
  );
}
