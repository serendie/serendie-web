import { Tooltip, Button } from "@serendie/ui";
import { styled } from "../../../styled-system/jsx";

const Label = styled("span", {
  base: {
    fontSize: "sm",
    minWidth: "120px",
    textAlign: "right",
  },
});

const Grid = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    width: "fit-content",
    margin: "0 auto",
    rowGap: "sd.system.dimension.spacing.medium",
    columnGap: "sd.system.dimension.spacing.large",
    pr: "sd.system.dimension.spacing.medium",
  },
});

const GridItemContainer = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "subgrid",
    gridColumn: "span 2",
    alignItems: "center",
  },
});

export function DelaySample() {
  return (
    <Grid>
      <GridItemContainer>
        <Label>即座に表示:</Label>
        <Tooltip content="遅延なしで即座に表示されます" openDelay={0}>
          <Button>すぐ表示</Button>
        </Tooltip>
      </GridItemContainer>

      <GridItemContainer>
        <Label>表示時に遅延 (1秒):</Label>
        <Tooltip content="1秒後に表示されます" openDelay={1000}>
          <Button>1秒後に表示</Button>
        </Tooltip>
      </GridItemContainer>

      <GridItemContainer>
        <Label>非表示時に遅延 (2秒):</Label>
        <Tooltip
          content="マウスを離してから2秒後に非表示になります"
          closeDelay={2000}
        >
          <Button>2秒後に非表示</Button>
        </Tooltip>
      </GridItemContainer>

      <GridItemContainer>
        <Label>両方遅延:</Label>
        <Tooltip
          content="0.5秒後に表示、1秒後に非表示"
          openDelay={500}
          closeDelay={1000}
        >
          <Button>両方遅延</Button>
        </Tooltip>
      </GridItemContainer>
    </Grid>
  );
}
