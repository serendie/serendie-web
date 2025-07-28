import { ResponsiveBar } from "@nivo/bar";
import { useBarChartProps } from "@serendie/ui";
import { styled } from "../../../styled-system/jsx";

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "sd.system.dimension.spacing.xlarge",
  },
});

const ChartSection = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "sd.system.dimension.spacing.small",
  },
});

const ChartTitle = styled("h3", {
  base: {
    fontSize: "sd.system.typography.fontSize.medium",
    fontWeight: "sd.system.typography.fontWeight.bold",
    margin: 0,
  },
});

const VerticalChartContainer = styled("div", {
  base: {
    height: "300px",
    width: "100%",
    margin: "0 auto",
  },
});

const HorizontalChartContainer = styled("div", {
  base: {
    height: "400px",
    width: "100%",
    margin: "0 auto",
  },
});

const barData = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 45 },
  { month: "Mar", value: 60 },
  { month: "Apr", value: 35 },
  { month: "May", value: 50 },
  { month: "Jun", value: 70 },
];

export function BarChartSample() {
  const verticalBarProps = useBarChartProps("primary");
  const horizontalBarProps = useBarChartProps("notice");

  return (
    <Container>
      <ChartSection>
        <ChartTitle>Vertical Bar Chart</ChartTitle>
        <VerticalChartContainer>
          <ResponsiveBar
            data={barData}
            keys={["value"]}
            indexBy="month"
            {...verticalBarProps}
          />
        </VerticalChartContainer>
      </ChartSection>

      <ChartSection>
        <ChartTitle>Horizontal Bar Chart</ChartTitle>
        <HorizontalChartContainer>
          <ResponsiveBar
            data={barData}
            keys={["value"]}
            indexBy="month"
            {...horizontalBarProps}
            layout="horizontal"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              legend: "Value",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              legend: "Month",
              legendPosition: "middle",
              legendOffset: -40,
            }}
          />
        </HorizontalChartContainer>
      </ChartSection>
    </Container>
  );
}
