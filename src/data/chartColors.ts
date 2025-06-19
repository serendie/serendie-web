import { token } from "styled-system/tokens";
import type { ChartColorData } from "@/components/ChartColorMatrix";

// Chart color palette data definitions
export const chartColors: Record<string, ChartColorData> = {
  single: {
    shades: ["01", "02", "03", "04", "05", "06"],
    rows: [
      {
        name: "Primary/Konjo",
        colors: {
          "01": token("colors.sd.reference.color.scale.blue.200"),
          "02": token("colors.sd.reference.color.scale.blue.300"),
          "03": token("colors.sd.reference.color.scale.blue.400"),
          "04": token("colors.sd.reference.color.scale.blue.500"),
          "05": token("colors.sd.reference.color.scale.blue.600"),
          "06": token("colors.sd.reference.color.scale.blue.900"),
        },
      },
      {
        name: "Primary/Kurikawa",
        colors: {
          "01": token("colors.sd.reference.color.scale.chestnut.200"),
          "02": token("colors.sd.reference.color.scale.chestnut.300"),
          "03": token("colors.sd.reference.color.scale.chestnut.400"),
          "04": token("colors.sd.reference.color.scale.chestnut.500"),
          "05": token("colors.sd.reference.color.scale.chestnut.600"),
          "06": token("colors.sd.reference.color.scale.chestnut.900"),
        },
      },
      {
        name: "Primary/Tsutsuji",
        colors: {
          "01": token("colors.sd.reference.color.scale.pink.200"),
          "02": token("colors.sd.reference.color.scale.pink.300"),
          "03": token("colors.sd.reference.color.scale.pink.400"),
          "04": token("colors.sd.reference.color.scale.pink.500"),
          "05": token("colors.sd.reference.color.scale.pink.600"),
          "06": token("colors.sd.reference.color.scale.pink.900"),
        },
      },
      {
        name: "Primary/Sumire",
        colors: {
          "01": token("colors.sd.reference.color.scale.purple.200"),
          "02": token("colors.sd.reference.color.scale.purple.300"),
          "03": token("colors.sd.reference.color.scale.purple.400"),
          "04": token("colors.sd.reference.color.scale.purple.500"),
          "05": token("colors.sd.reference.color.scale.purple.600"),
          "06": token("colors.sd.reference.color.scale.purple.900"),
        },
      },
      {
        name: "Primary/Asagi",
        colors: {
          "01": token("colors.sd.reference.color.scale.skyBlue.200"),
          "02": token("colors.sd.reference.color.scale.skyBlue.300"),
          "03": token("colors.sd.reference.color.scale.skyBlue.400"),
          "04": token("colors.sd.reference.color.scale.skyBlue.500"),
          "05": token("colors.sd.reference.color.scale.skyBlue.600"),
          "06": token("colors.sd.reference.color.scale.skyBlue.900"),
        },
      },
    ],
  },
  semantic: {
    shades: ["01", "02", "03", "04", "05", "06"],
    rows: [
      {
        name: "Positive",
        colors: {
          "01": token("colors.sd.system.color.chart.mark.positive.01"),
          "02": token("colors.sd.system.color.chart.mark.positive.02"),
          "03": token("colors.sd.system.color.chart.mark.positive.03"),
          "04": token("colors.sd.system.color.chart.mark.positive.04"),
          "05": token("colors.sd.system.color.chart.mark.positive.05"),
          "06": token("colors.sd.system.color.chart.mark.positive.06"),
        },
      },
      {
        name: "Negative",
        colors: {
          "01": token("colors.sd.system.color.chart.mark.negative.01"),
          "02": token("colors.sd.system.color.chart.mark.negative.02"),
          "03": token("colors.sd.system.color.chart.mark.negative.03"),
          "04": token("colors.sd.system.color.chart.mark.negative.04"),
          "05": token("colors.sd.system.color.chart.mark.negative.05"),
          "06": token("colors.sd.system.color.chart.mark.negative.06"),
        },
      },
      {
        name: "Notice",
        colors: {
          "01": token("colors.sd.system.color.chart.mark.notice.01"),
          "02": token("colors.sd.system.color.chart.mark.notice.02"),
          "03": token("colors.sd.system.color.chart.mark.notice.03"),
          "04": token("colors.sd.system.color.chart.mark.notice.04"),
          "05": token("colors.sd.system.color.chart.mark.notice.05"),
          "06": token("colors.sd.system.color.chart.mark.notice.06"),
        },
      },
    ],
  },
  multi: {
    shades: ["01", "02", "03", "04", "05", "06", "07", "08", "09"],
    rows: [
      {
        name: "Multi",
        colors: {
          "01": token("colors.sd.system.color.chart.mark.multi.01"),
          "02": token("colors.sd.system.color.chart.mark.multi.02"),
          "03": token("colors.sd.system.color.chart.mark.multi.03"),
          "04": token("colors.sd.system.color.chart.mark.multi.04"),
          "05": token("colors.sd.system.color.chart.mark.multi.05"),
          "06": token("colors.sd.system.color.chart.mark.multi.06"),
          "07": token("colors.sd.system.color.chart.mark.multi.07"),
          "08": token("colors.sd.system.color.chart.mark.multi.08"),
          "09": token("colors.sd.system.color.chart.mark.multi.09"),
          "10": token("colors.sd.system.color.chart.mark.multi.10"),
        },
      },
    ],
  },
  component: {
    shades: [""],
    rows: [
      {
        name: "Surface",
        colors: {
          "": token("colors.sd.system.color.chart.component.chartSurface"),
        },
      },
      {
        name: "onSurface",
        colors: {
          "": token("colors.sd.system.color.chart.component.onChartSurface"),
        },
      },
      {
        name: "onMarkLabel",
        colors: {
          "": token("colors.sd.system.color.chart.component.onMarkLabel"),
        },
      },
      {
        name: "inverseOnMarkLabel",
        colors: {
          "": token(
            "colors.sd.system.color.chart.component.inverseOnMarkLabel"
          ),
        },
      },
      {
        name: "scaleMark",
        colors: {
          "": token("colors.sd.system.color.chart.component.scalemark"),
        },
      },
      {
        name: "threshold",
        colors: {
          "": token("colors.sd.system.color.chart.component.threshold"),
        },
      },
    ],
  },
};
