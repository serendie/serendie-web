import React from "react";
import { css } from "styled-system/css";

interface ChartColorMatrixProps {
  type: "single" | "semantic" | "multi";
}

// チャートカラーパレットのデータ定義
const chartColors = {
  single: {
    shades: ["01", "02", "03", "04", "05", "06"],
    rows: [
      {
        name: "Primary/Konjo",
        colors: {
          "01": "#d7defb",
          "02": "#bfcefc",
          "03": "#8faefe",
          "04": "#428cfe",
          "05": "#0a69cf",
          "06": "#073165",
        },
      },
      {
        name: "Primary/Kurikawa",
        colors: {
          "01": "#f7d8c9",
          "02": "#f7c6b0",
          "03": "#f49567",
          "04": "#e26324",
          "05": "#ab4919",
          "06": "#50230d",
        },
      },
      {
        name: "Primary/Tsutsuji",
        colors: {
          "01": "#f6d7e0",
          "02": "#f5c1d1",
          "03": "#f190b4",
          "04": "#eb4f8e",
          "05": "#932653",
          "06": "#591734",
        },
      },
      {
        name: "Primary/Sumire",
        colors: {
          "01": "#eadaee",
          "02": "#dcbde4",
          "03": "#cc9fd9",
          "04": "#aa61c2",
          "05": "#733b85",
          "06": "#462352",
        },
      },
      {
        name: "Primary/Asagi",
        colors: {
          "01": "#c3eff4",
          "02": "#9ce6ec",
          "03": "#64ccd3",
          "04": "#00a3af",
          "05": "#00757e",
          "06": "#02373c",
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
          "01": "#d4f4e8",
          "02": "#b0ecd2",
          "03": "#7dddb0",
          "04": "#4fc988",
          "05": "#2bb563",
          "06": "#145c31",
        },
      },
      {
        name: "Negative",
        colors: {
          "01": "#ffdbdb",
          "02": "#ffc2c2",
          "03": "#ff9999",
          "04": "#ff6666",
          "05": "#e52e2e",
          "06": "#991919",
        },
      },
      {
        name: "Notice",
        colors: {
          "01": "#fff8cc",
          "02": "#fff299",
          "03": "#ffe866",
          "04": "#ffdb33",
          "05": "#ccad00",
          "06": "#665600",
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
          "01": "#428cfe",
          "02": "#64ccd3",
          "03": "#ff9999",
          "04": "#cc9fd9",
          "05": "#b87333",
          "06": "#9ce6ec",
          "07": "#ffe866",
          "08": "#f190b4",
          "09": "#c7b299",
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
                      borderWidth: color.toLowerCase() === "#ffffff" ? 1 : 0,
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
