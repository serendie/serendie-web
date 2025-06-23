import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export function getComponentInfoTool(server: McpServer) {
  server.registerTool(
    "get-component-info",
    {
      title: "Get Component Information",
      description:
        "Retrieve detailed information about Serendie UI components including properties, usage examples, and best practices",
      inputSchema: {
        componentName: z
          .string()
          .optional()
          .describe(
            "The name of the component to get info for (e.g., 'button', 'modal-dialog'). If not specified, returns a list of all components."
          ),
      },
    },
    async ({ componentName }) => {
      try {
        const componentsDir = path.join(
          process.cwd(),
          "src",
          "content",
          "components"
        );

        if (!componentName) {
          // Return list of all components
          const files = await fs.readdir(componentsDir);
          const components = await Promise.all(
            files
              .filter((file) => file.endsWith(".mdx"))
              .map(async (file) => {
                const filePath = path.join(componentsDir, file);
                const content = await fs.readFile(filePath, "utf-8");
                const { data } = matter(content);
                return {
                  id: file.replace(".mdx", ""),
                  title: data.title || file.replace(".mdx", ""),
                  componentName: data.componentName || "",
                  description: data.description || "",
                  lastUpdated: data.lastUpdated || "",
                };
              })
          );

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    totalComponents: components.length,
                    components: components.sort((a, b) =>
                      a.title.localeCompare(b.title)
                    ),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        // Get specific component info
        const componentPath = path.join(componentsDir, `${componentName}.mdx`);

        try {
          const content = await fs.readFile(componentPath, "utf-8");
          const { data, content: mdxContent } = matter(content);

          // Extract code examples from the MDX content
          const codeExamples = [];
          const codeRegex =
            /<Code[\s\S]*?title="([^"]*)"[\s\S]*?description="([^"]*)"[\s\S]*?>/g;
          let match;
          while ((match = codeRegex.exec(mdxContent)) !== null) {
            codeExamples.push({
              title: match[1],
              description: match[2],
            });
          }

          // Extract imported sample components
          const importRegex =
            /import\s+{?\s*(\w+)\s*}?\s+from\s+"@\/sampleCode\/([^"]+)"/g;
          const sampleComponents = [];
          let importMatch;
          while ((importMatch = importRegex.exec(mdxContent)) !== null) {
            sampleComponents.push({
              name: importMatch[1],
              path: importMatch[2],
            });
          }

          const componentInfo = {
            id: componentName,
            title: data.title,
            componentName: data.componentName,
            description: data.description,
            lastUpdated: data.lastUpdated,
            codeExamples,
            sampleComponents,
            storybook: codeExamples.some(() =>
              mdxContent.includes("storyPath=")
            ),
          };

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(componentInfo, null, 2),
              },
            ],
            structuredContent: componentInfo,
          };
        } catch (_error) {
          return {
            content: [
              {
                type: "text",
                text: `Component '${componentName}' not found. Use the tool without componentName to see all available components.`,
              },
            ],
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error retrieving component information: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
      }
    }
  );
}
