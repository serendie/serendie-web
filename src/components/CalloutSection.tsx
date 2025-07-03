import type { ReactNode } from "react";
import { css } from "styled-system/css";

interface CalloutSectionProps {
  number?: number | string;
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function CalloutSection({
  number,
  title,
  description,
  children,
}: CalloutSectionProps) {
  return (
    <div
      className={css({
        backgroundColor: "sd.reference.color.scale.blue.100",
        borderRadius: "24px",
        padding: "24px",
        position: "relative",
        marginBottom: "24px",
        minHeight: "100px",
        marginTop: "24px",
      })}
    >
      {(number || title) && (
        <div
          className={css({
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "12px",
          })}
        >
          {number && (
            <div
              className={css({
                backgroundColor:
                  "sd.system.color.impression.onPrimaryContainer",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                borderRadius: "50%",
              })}
            >
              <span
                className={css({
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "web.system.color.component.onSurface",
                  lineHeight: 1.6,
                })}
              >
                {number}
              </span>
            </div>
          )}
          {title && (
            <h3
              className={css({
                fontSize: "24px !important",
                fontWeight: "bold",
                color: "web.system.color.component.onSurface",
                lineHeight: 1.6,
                margin: "0 !important",
              })}
            >
              {title}
            </h3>
          )}
        </div>
      )}
      {description && (
        <p
          className={css({
            fontSize: "14px",
            color: "web.system.color.component.onSurface",
            lineHeight: 1.6,
            mt: "4px !important",
            whiteSpace: "pre-wrap",
          })}
        >
          {description}
        </p>
      )}
      {children && <div className={css({})}>{children}</div>}
    </div>
  );
}
