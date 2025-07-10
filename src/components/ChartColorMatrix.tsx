import React from "react";
import { css } from "styled-system/css";

// Type definitions for chart color data
export interface ChartColorRow {
  name: string;
  colors: Record<string, string>;
  tokenNames?: Record<string, string>;
}

export interface ChartColorData {
  shades: string[];
  rows: ChartColorRow[];
}

export interface ChartColorMatrixProps {
  data: ChartColorData;
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

function isLightColor(color: string): boolean {
  const rgb = hexToRgb(color);
  // 輝度を計算
  const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  // 240以上を白に近い色と判定
  return luminance > 240;
}

export const ChartColorMatrix: React.FC<ChartColorMatrixProps> = ({ data }) => {
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = React.useState<string | null>(null);

  const handleCellClick = (tokenName: string | undefined) => {
    if (tokenName && navigator.clipboard) {
      navigator.clipboard
        .writeText(tokenName)
        .then(() => {
          setCopiedToken(tokenName);
          setTimeout(() => {
            setCopiedToken(null);
          }, 1000);
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
        });
    }
  };

  const cellClass = css({
    h: "48px",
    position: "relative",
    cursor: "pointer",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "sd.system.color.component.outline",
    overflow: "visible",
    _hover: {
      "& span": {
        opacity: 1,
      },
      "& .tooltip": {
        opacity: 1,
        visibility: "visible",
      },
    },
    expandedDown: {
      cursor: "default",
      overflowX: "auto",
      overflowY: "hidden",
    },
  });

  // ツールチップのスタイルを生成する関数
  const getTooltipClass = (isVisible: boolean = false) => {
    return css({
      position: "absolute",
      bottom: "calc(50% + 6px)",
      left: "50%",
      transform: "translateX(-50%)",
      bg: "sd.system.color.component.inverseSurface",
      color: "sd.system.color.component.inverseOnSurface",
      px: "sd.system.dimension.spacing.small",
      py: "sd.system.dimension.spacing.extraSmall",
      borderRadius: "4px",
      fontSize: "12px",
      lineHeight: 1.5,
      boxShadow: "sd.system.elevation.shadow.level3",
      fontFamily: "sd.reference.typography.fontFamily.monospace",
      whiteSpace: "nowrap",
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? "visible" : "hidden",
      transition: "opacity 0.2s, visibility 0.2s",
      zIndex: 1000,
      pointerEvents: "none",
      minWidth: "48px",
      _after: {
        content: '""',
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: "6px 6px 0 6px",
        borderLeftColor: "rgba(0, 0, 0, 0)",
        borderRightColor: "rgba(0, 0, 0, 0)",
        borderBottomColor: "rgba(0, 0, 0, 0)",
        borderTopColor: "sd.system.color.component.inverseSurface",
      },
      expandedDown: {
        display: "none",
      },
    });
  };

  return (
    <div
      className={css({
        mt: "sd.system.dimension.spacing.twoExtraLarge",
        mb: "sd.system.dimension.spacing.medium",
        overflowX: "visible",
        overflowY: "visible",
        position: "relative",
        px: "sd.system.dimension.spacing.extraLarge",
        mx: "-sd.system.dimension.spacing.extraLarge",
        expandedDown: {
          overflowX: "auto",
          overflowY: "visible",
        },
      })}
    >
      <table
        className={css({
          borderCollapse: "separate",
          borderSpacing: "0 16px",
          width: "100%",
          position: "relative",
          overflow: "visible",
          expandedDown: {
            overflowX: "auto",
            overflowY: "hidden",
          },
        })}
      >
        <thead>
          <tr>
            <th className={css({})}></th>
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
                  expandedDown: {
                    _before: {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-24px",
                      width: "24px",
                      height: "100%",
                      backgroundColor: "sd.system.color.component.surface",
                    },
                  },
                })}
              >
                <div>{row.name}</div>
              </th>
              {data.shades.map((shade) => {
                const color = row.colors[shade as keyof typeof row.colors];
                const tokenName =
                  "sd." +
                  row.tokenNames?.[shade as keyof typeof row.tokenNames];

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
                        borderWidth: isLightColor(color) ? 1 : 0,
                      }}
                      onClick={() => {
                        handleCellClick(tokenName);
                      }}
                      onMouseEnter={() =>
                        tokenName && setHoveredCell(`${row.name}-${shade}`)
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {tokenName && (
                        <div
                          className={`tooltip tooltip-${row.name}-${shade} ${getTooltipClass(
                            copiedToken === tokenName ||
                              hoveredCell === `${row.name}-${shade}`
                          )}`}
                        >
                          {copiedToken === tokenName ? "Copied!" : tokenName}
                        </div>
                      )}
                    </div>
                  </td>
                ) : null;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
