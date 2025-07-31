import { ResponsiveLine } from "@nivo/line";
import { useLineChartProps } from "@serendie/ui";
import { styled } from "../../../styled-system/jsx";

const ChartContainer = styled("div", {
  base: {
    height: "300px",
    width: "100%",
    margin: "0 auto",
  },
});

const lineData = [
  {
    id: "Desktop",
    data: [
      { x: "Jan", y: 120 },
      { x: "Feb", y: 150 },
      { x: "Mar", y: 180 },
      { x: "Apr", y: 220 },
      { x: "May", y: 240 },
      { x: "Jun", y: 280 },
    ],
  },
  {
    id: "Mobile",
    data: [
      { x: "Jan", y: 80 },
      { x: "Feb", y: 100 },
      { x: "Mar", y: 120 },
      { x: "Apr", y: 140 },
      { x: "May", y: 180 },
      { x: "Jun", y: 200 },
    ],
  },
  {
    id: "Tablet",
    data: [
      { x: "Jan", y: 40 },
      { x: "Feb", y: 45 },
      { x: "Mar", y: 50 },
      { x: "Apr", y: 55 },
      { x: "May", y: 60 },
      { x: "Jun", y: 65 },
    ],
  },
];

export function LineChartSample() {
  const lineProps = useLineChartProps("multi");

  return (
    <ChartContainer>
      <ResponsiveLine
        data={lineData}
        {...lineProps}
        axisBottom={{
          legend: "Month",
          legendPosition: "middle",
          legendOffset: 36,
        }}
        axisLeft={{
          legend: "Value",
          legendPosition: "middle",
          legendOffset: -40,
        }}
      />
    </ChartContainer>
  );
}
