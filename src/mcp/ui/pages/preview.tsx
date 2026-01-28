import { useEffect, useState } from "react";
import { ComponentPreview } from "../../../components/Preview/ComponentPreview";
import { availableComponents } from "../../../components/Preview/sampleCodeRegistry";
import { useComponentFromToolResult } from "../hooks/useMcpApp";
import { ProgressIndicatorIndeterminate } from "@serendie/ui";
import "../../../index.css";

// Safe area insets type
interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Default minimum height for the preview (ensures visibility on mobile)
const MIN_HEIGHT = 400;

export const PreviewPage = () => {
  const { app, componentName: toolComponentName, isLoading } =
    useComponentFromToolResult();
  const [selectedComponent, setSelectedComponent] = useState<string>("Button");
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  // Handle host context changes (theme, safe area, viewport)
  useEffect(() => {
    if (!app) return;

    // Get initial context
    const context = app.getHostContext();
    if (context?.safeAreaInsets) {
      setSafeAreaInsets(context.safeAreaInsets);
    }
    if (context?.viewport?.maxHeight) {
      setMaxHeight(context.viewport.maxHeight);
    }

    // Listen for context changes
    app.onhostcontextchanged = (ctx) => {
      console.log("[Preview] Host context changed:", ctx);
      if (ctx.safeAreaInsets) {
        setSafeAreaInsets(ctx.safeAreaInsets);
      }
      if (ctx.viewport?.maxHeight) {
        setMaxHeight(ctx.viewport.maxHeight);
      }
    };
  }, [app]);

  useEffect(() => {
    // Wait until we have a component name from the tool result
    if (toolComponentName) {
      console.log("[Preview] Component from MCP Apps:", toolComponentName);

      // Validate component exists
      if (availableComponents.includes(toolComponentName)) {
        setSelectedComponent(toolComponentName);
      } else {
        console.warn(
          `[Preview] Component "${toolComponentName}" not found. Available:`,
          availableComponents
        );
        setSelectedComponent("Button"); // Fallback to Button
      }
    }
  }, [toolComponentName]);

  // Calculate container height
  const containerHeight = maxHeight
    ? Math.max(maxHeight, MIN_HEIGHT)
    : MIN_HEIGHT;

  return (
    <div
      style={{
        width: "100%",
        minHeight: `${containerHeight}px`,
        position: "relative",
        paddingTop: safeAreaInsets.top,
        paddingRight: safeAreaInsets.right,
        paddingBottom: safeAreaInsets.bottom,
        paddingLeft: safeAreaInsets.left,
        boxSizing: "border-box",
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            minHeight: `${containerHeight}px`,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ProgressIndicatorIndeterminate type="circular" size="large" />
            <div
              style={{
                fontSize: "16px",
                color: "#333",
                marginTop: "16px",
              }}
            >
              Loading component...
            </div>
          </div>
        </div>
      )}

      {/* Preload all components, but only display the selected one */}
      {!isLoading &&
        availableComponents.map((componentName) => (
          <div
            key={componentName}
            style={{
              display: componentName === selectedComponent ? "block" : "none",
              width: "100%",
              minHeight: `${containerHeight - safeAreaInsets.top - safeAreaInsets.bottom}px`,
            }}
          >
            <ComponentPreview componentName={componentName} />
          </div>
        ))}
    </div>
  );
};
