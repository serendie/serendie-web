import React from "react";
import { css } from "styled-system/css";

// Type definitions for chart color data
export interface ChartColorRow {
  name: string;
  colors: Record<string, string>;
}

export interface ChartColorData {
  shades: string[];
  rows: ChartColorRow[];
}

export interface ChartColorMatrixProps {
  data: ChartColorData;
}

// Helper functions
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

export const ChartColorMatrix: React.FC<ChartColorMatrixProps> = ({ data }) => {
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
