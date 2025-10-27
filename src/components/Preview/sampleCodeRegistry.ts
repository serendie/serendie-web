import type { ComponentType } from "react";

export interface SampleInfo {
  name: string;
  component: () => Promise<{ [key: string]: ComponentType }>;
}

export interface ComponentRegistry {
  [componentName: string]: SampleInfo[];
}

// Auto-import all sample code files using Vite's import.meta.glob
const sampleModules = import.meta.glob("../../sampleCode/**/*.tsx");

// Build registry from discovered files
function buildRegistry(): ComponentRegistry {
  const registry: ComponentRegistry = {};

  for (const path in sampleModules) {
    // Extract component name and sample name from path
    // Example: "../../sampleCode/Badge/ColorSample.tsx"
    const match = path.match(/\/sampleCode\/([^/]+)\/(.+)\.tsx$/);
    if (!match) continue;

    const [, componentName, fileName] = match;

    if (!registry[componentName]) {
      registry[componentName] = [];
    }

    registry[componentName].push({
      name: fileName,
      component: sampleModules[path] as () => Promise<{
        [key: string]: ComponentType;
      }>,
    });
  }

  // Sort samples alphabetically within each component
  for (const componentName in registry) {
    registry[componentName].sort((a, b) => a.name.localeCompare(b.name));
  }

  return registry;
}

export const sampleCodeRegistry: ComponentRegistry = buildRegistry();

export const availableComponents = Object.keys(sampleCodeRegistry).sort();
