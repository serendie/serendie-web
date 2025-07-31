import { ResponsivePie } from "@nivo/pie";
import { usePieChartProps } from "@serendie/ui";
import { styled } from "../../../styled-system/jsx";

const ChartContainer = styled("div", {
  base: {
    height: "400px",
    width: "100%",
    margin: "0 auto",
  },
});

const pieData = [
  { id: "Desktop", label: "Desktop", value: 45 },
  { id: "Mobile", label: "Mobile", value: 30 },
  { id: "Tablet", label: "Tablet", value: 15 },
  { id: "Smart TV", label: "Smart TV", value: 10 },
];

export function PieChartSample() {
  const pieProps = usePieChartProps("primary");

  return (
    <ChartContainer>
      <ResponsivePie data={pieData} {...pieProps} />
    </ChartContainer>
  );
}
