import { useEffect, useState, Suspense } from "react";
import { css } from "../../../styled-system/css";
import { Tabs, TabItem } from "@serendie/ui";
import { sampleCodeRegistry, availableComponents } from "./sampleCodeRegistry";
import type { ComponentType } from "react";

interface ComponentPreviewProps {
  componentName: string;
}

interface LoadedSample {
  name: string;
  Component: ComponentType;
}

export function ComponentPreview({ componentName }: ComponentPreviewProps) {
  const [samples, setSamples] = useState<LoadedSample[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("0");

  useEffect(() => {
    const loadSamples = async () => {
      // Check if component exists
      if (!availableComponents.includes(componentName)) {
        setError(
          `Component "${componentName}" not found. Available components: ${availableComponents.join(", ")}`
        );
        setLoading(false);
        return;
      }

      try {
        const sampleInfos = sampleCodeRegistry[componentName];
        const loadedSamples: LoadedSample[] = [];

        for (const sampleInfo of sampleInfos) {
          const module = await sampleInfo.component();
          // Get the exported component (could be named export or default)
          const Component =
            module[sampleInfo.name] ||
            module.default ||
            Object.values(module)[0];

          if (Component) {
            loadedSamples.push({
              name: sampleInfo.name,
              Component: Component as ComponentType,
            });
          }
        }

        setSamples(loadedSamples);
        setLoading(false);
        setActiveTab("0"); // Reset to first tab when component changes
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load samples");
        setLoading(false);
      }
    };

    loadSamples();
  }, [componentName]);

  if (loading) {
    return (
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          fontSize: "16px",
        })}
      >
        Loading {componentName} samples...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          fontSize: "16px",
          color: "red.600",
          padding: "20px",
          textAlign: "center",
        })}
      >
        <div>
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const activeSample = samples[Number.parseInt(activeTab, 10)];

  return (
    <div
      className={css({
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "sd.system.color.component.surface",
        overflow: "hidden",
      })}
    >
      {/* Top Navigation with Tabs */}
      <header
        className={css({
          borderBottom: "1px solid",
          borderColor: "sd.system.color.component.outline",
          backgroundColor: "sd.system.color.component.surface",
        })}
      >
        <h1
          className={css({
            textStyle: "sd.system.typography.headline.small_expanded",
            marginBottom: "sd.system.dimension.spacing.small",
            pt: "sd.system.dimension.spacing.medium",
            px: "sd.system.dimension.spacing.medium",
            color: "sd.system.color.component.onSurface",
          })}
        >
          {componentName}
        </h1>
        <Tabs
          value={activeTab}
          onValueChange={(details) => setActiveTab(details.value)}
        >
          {samples.map((sample, index) => (
            <TabItem key={index} title={sample.name} value={String(index)} />
          ))}
        </Tabs>
      </header>

      {/* Main Content Area - Centered */}
      {activeSample && (
        <main
          className={css({
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "sd.system.dimension.spacing.large",
            overflow: "auto",
          })}
        >
          <div
            className={css({
              width: "100%",
              maxWidth: "1200px",
            })}
          >
            <Suspense fallback={<div>Loading sample...</div>}>
              <activeSample.Component />
            </Suspense>
          </div>
        </main>
      )}
    </div>
  );
}
