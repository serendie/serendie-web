import { useEffect, useState } from "react";
import { ComponentPreview } from "../../../components/Preview/ComponentPreview";
import { availableComponents } from "../../../components/Preview/sampleCodeRegistry";
import { useToolOutput } from "../hooks/useOpenAiGlobal";
import { ProgressIndicatorIndeterminate } from "@serendie/ui";
import "../../../index.css";

interface ToolOutput {
  componentName?: string;
  name?: string;
}

export const PreviewPage = () => {
  const toolOutput = useToolOutput<ToolOutput>();
  const [selectedComponent, setSelectedComponent] = useState<string>("Button");

  // Show loading when toolOutput is null or undefined
  const isLoading = !toolOutput;

  useEffect(() => {
    // Wait until toolOutput has actual data
    if (toolOutput) {
      // Get component name from toolOutput
      const componentName =
        toolOutput?.componentName || toolOutput?.name || "Button"; // default fallback

      console.log("[Preview] toolOutput:", toolOutput);
      console.log("[Preview] Selected component:", componentName);

      // Validate component exists
      if (availableComponents.includes(componentName)) {
        setSelectedComponent(componentName);
      } else {
        console.warn(
          `[Preview] Component "${componentName}" not found. Available:`,
          availableComponents
        );
        setSelectedComponent("Button"); // Fallback to Button
      }
    }
  }, [toolOutput]);

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
