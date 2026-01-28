import { useEffect, useState } from "react";
import { ComponentPreview } from "../../../components/Preview/ComponentPreview";
import { availableComponents } from "../../../components/Preview/sampleCodeRegistry";
import { useComponentFromToolResult } from "../hooks/useMcpApp";
import { ProgressIndicatorIndeterminate } from "@serendie/ui";
import "../../../index.css";

export const PreviewPage = () => {
  const { componentName: toolComponentName, isLoading } =
    useComponentFromToolResult();
  const [selectedComponent, setSelectedComponent] = useState<string>("Button");

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

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
              height: "100%",
            }}
          >
            <ComponentPreview componentName={componentName} />
          </div>
        ))}
    </div>
  );
};
