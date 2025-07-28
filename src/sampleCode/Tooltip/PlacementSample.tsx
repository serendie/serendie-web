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

export function PlacementSample() {
  return (
    <Grid>
      <GridItem>
        <Tooltip content="上開始" placement="top-start">
          <Button size="small" styleType="ghost">
            Top Start
          </Button>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="上" placement="top">
          <Button size="small" styleType="ghost">
            Top
          </Button>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="上終了" placement="top-end">
          <Button size="small" styleType="ghost">
            Top End
          </Button>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="左" placement="left">
          <Button size="small" styleType="ghost">
            Left
          </Button>
        </Tooltip>
      </GridItem>

      <GridItem />

      <GridItem>
        <Tooltip content="右" placement="right">
          <Button size="small" styleType="ghost">
            Right
          </Button>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="下開始" placement="bottom-start">
          <Button size="small" styleType="ghost">
            Bottom Start
          </Button>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="下" placement="bottom">
          <Button size="small" styleType="ghost">
            Bottom
          </Button>
        </Tooltip>
      </GridItem>

      <GridItem>
        <Tooltip content="下終了" placement="bottom-end">
          <Button size="small" styleType="ghost">
            Bottom End
          </Button>
        </Tooltip>
      </GridItem>
    </Grid>
  );
}
