import { Tooltip, Button } from "@serendie/ui";
import { styled } from "../../../styled-system/jsx";

const Span = styled("span", {
  base: {
    width: 'fit-content',
  },
});

const Label = styled("span", {
  base: {
    fontSize: "sm",
    minWidth: "80px",
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

export function StateSample() {
  return (
    <Grid>
      <GridItemContainer>
        <Label>プロパティなし:</Label>
        <Tooltip content="これは有効なツールチップです">
          <Span><Button>enabledの場合</Button></Span>
        </Tooltip>
      </GridItemContainer>

      <GridItemContainer>
        <Label>disabled:</Label>
        <Tooltip content="このツールチップは表示されません" disabled>
          <Span><Button>disabledの場合</Button></Span>
        </Tooltip>
      </GridItemContainer>
    </Grid>
  );
}
