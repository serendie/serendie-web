import { Tooltip, Button } from "@serendie/ui";
import { styled } from "../../../styled-system/jsx";

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
          <Button>有効なボタン</Button>
        </Tooltip>
      </GridItemContainer>

      <GridItemContainer>
        <Label>disabled:</Label>
        <Tooltip content="このツールチップは表示されません" disabled>
          <Button>無効なツールチップ</Button>
        </Tooltip>
      </GridItemContainer>

      <GridItemContainer>
        <Label>内部要素がdisabled:</Label>
        <Tooltip content="ボタンが無効な場合はツールチップも無効">
          <Button disabled>無効なボタン</Button>
        </Tooltip>
      </GridItemContainer>
    </Grid>
  );
}
