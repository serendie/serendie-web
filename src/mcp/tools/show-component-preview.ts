import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Debug tool to show component preview with minimal setup
 * This tool is designed to test OpenAI Apps SDK integration
 */
export function showComponentPreviewTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "show-component-preview",
    {
      title: "Show Component Preview",
      description:
        "Display a live preview of a Serendie UI component in an interactive widget (DEBUG TOOL)",
      _meta: {
        // Associate this tool with the HTML template
        "openai/outputTemplate": "ui://serendie/component-preview.html",
        // Labels to display in ChatGPT when the tool is called
        "openai/toolInvocation/invoking": "Loading component preview...",
        "openai/toolInvocation/invoked": "Component preview loaded",
      },
      inputSchema: {
        componentName: z
          .string()
          .describe(
            "The name of the component to preview (e.g., 'Button', 'TextField')"
          ),
      },
    },
    async ({ componentName }) => {
      try {
        // Return minimal response for debugging
        return {
          content: [
            {
              type: "text",
              text: `Showing preview for component: ${componentName}`,
            },
          ],
          // OpenAI Apps SDK: Pass component name via structuredContent
          structuredContent: {
            componentName,
          },
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "Failed to show component preview",
                message:
                  error instanceof Error ? error.message : "Unknown error",
              }),
            },
          ],
        };
      }
    }
  );
}
