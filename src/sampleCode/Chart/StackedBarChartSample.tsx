import { ResponsiveBar } from "@nivo/bar";
import { useBarChartProps } from "@serendie/ui";
import { styled } from "../../../styled-system/jsx";
import serendieTokens from "@serendie/design-token";

const ChartContainer = styled("div", {
  base: {
    height: "400px",
    width: "100%",
    margin: "0 auto",
  },
});

const stackedData = [
  {
    category: "Category A",
    segment1: 20,
    segment2: 20,
    segment3: 20,
    segment4: 20,
    segment5: 20,
  },
  {
    category: "Category B",
    segment1: 15,
    segment2: 25,
    segment3: 20,
    segment4: 25,
    segment5: 15,
  },
  {
    category: "Category C",
    segment1: 30,
    segment2: 15,
    segment3: 20,
    segment4: 20,
    segment5: 15,
  },
  {
    category: "Category D",
    segment1: 10,
    segment2: 20,
    segment3: 30,
    segment4: 25,
    segment5: 15,
  },
];

export function StackedBarChartSample() {
  const barProps = useBarChartProps("primary");
  const labelFormat = (datum: string | number) =>
    Number(datum) > 0 ? "20%" : "";

  const spacingTokens = serendieTokens.sd.system.dimension.spacing;
  const margin = {
    top: parseInt(spacingTokens.large, 10),
    right: parseInt(spacingTokens.fiveExtraLarge, 10),
    bottom: parseInt(spacingTokens.fourExtraLarge, 10),
    left: parseInt(spacingTokens.fiveExtraLarge, 10),
  };

  return (
    <ChartContainer>
      <ResponsiveBar
        data={stackedData}
        keys={["segment1", "segment2", "segment3", "segment4", "segment5"]}
        indexBy="category"
        labelFormat={labelFormat}
        axisRight={{
          format: (value: number) => value + "%",
        }}
        {...barProps}
        margin={margin}
      />
    </ChartContainer>
  );
}
