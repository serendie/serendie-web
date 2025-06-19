import React from "react";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

interface ChartColorMatrixProps {
  type: "single" | "semantic" | "multi" | "component";
}

// チャートカラーパレットのデータ定義
const chartColors = {
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
          // sd/system/color/chart/component/onChartSurface
          "": token("colors.sd.system.color.chart.component.onChartSurface"),
        },
      },
      {
        name: "onMarkLabel",
        colors: {
          //sd/system/color/chart/component/onMarkLabel
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

function getTextColor(bgColor: string): string {
  const rgb = hexToRgb(bgColor);
  const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  const threshold = 169;
  return luminance > threshold ? "#000000" : "#FFFFFF";
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export const ChartColorMatrix: React.FC<ChartColorMatrixProps> = ({ type }) => {
  const data = chartColors[type];

  const handleColorClick = (color: string, element: HTMLDivElement) => {
    navigator.clipboard.writeText(color);
    const span = element.querySelector("span");
    if (span) {
      const originalText = span.textContent;
      span.textContent = "Copied";
      setTimeout(() => {
        span.textContent = originalText;
      }, 1000);
    }
  };

  const cellClass = css({
    h: "48px",
    position: "relative",
    cursor: "pointer",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "sd.system.color.component.outline",
    _hover: {
      "& span": {
        opacity: 1,
      },
    },
  });

  const textClass = css({
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "x-small",
    opacity: 0,
    transition: "opacity 0.2s",
  });

  return (
    <table
      className={css({
        borderCollapse: "separate",
        borderSpacing: "0 16px",
        width: "100%",
      })}
    >
      <thead>
        <tr>
          <th></th>
          {data.shades.map((shade) => (
            <th
              key={shade}
              className={css({
                fontFamily: "sd.reference.typography.fontFamily.monospace",
                fontSize: "12px",
                lineHeight: 1.2,
                pb: "sd.system.dimension.spacing.extraSmall",
                color: "sd.system.color.component.onSurfaceVariant",
                fontWeight: 400,
              })}
            >
              {shade}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row) => (
          <tr key={row.name} className="group">
            <th
              className={css({
                position: "sticky",
                left: 0,
                bg: "sd.system.color.component.surface",
                zIndex: 1,
                textAlign: "left",
                fontSize: "14px",
                lineHeight: 1.2,
                pr: "sd.system.dimension.spacing.extraSmall",
                fontWeight: 400,
              })}
            >
              <div>{row.name}</div>
            </th>
            {data.shades.map((shade) => {
              const color = row.colors[shade as keyof typeof row.colors];
              return color ? (
                <td
                  key={shade}
                  className={css({
                    textAlign: "center",
                    position: "relative",
                    height: "48px",
                    boxSizing: "content-box",
                    minWidth: "48px",
                  })}
                >
                  <div
                    className={cellClass}
                    style={{
                      backgroundColor: color,
                      borderWidth: color === "#ffffff" ? 1 : 0,
                    }}
                    onClick={(e) => handleColorClick(color, e.currentTarget)}
                  >
                    <span
                      className={textClass}
                      style={{ color: getTextColor(color) }}
                    >
                      {color}
                    </span>
                  </div>
                </td>
              ) : null;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
