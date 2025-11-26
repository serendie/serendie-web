import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getSymbolsTool, getSymbolDetailTool } from "./tools/symbols";
import {
  getDesignTokensTool,
  getDesignTokenDetailTool,
} from "./tools/design-tokens";
import { getComponentsTool, getComponentDetailTool } from "./tools/components";
import { getSerendieUIOverviewTool } from "./tools/serendie-ui-overview";
// Import preview HTML as string using Vite's ?raw import
// This avoids fs usage and works in Cloudflare Workers
import previewHtml from "./ui/preview.html?raw";
import { getSearchSerendieGuidelineTool } from "./tools/search-serendie-guideline";

export function createMcpServer() {
  const mcpServer = new McpServer({
    name: "serendie-mcp-server",
    version: "1.0.0",
    description: "MCP server for Serendie Design System documentation",
  });

  // Register tools
  getSerendieUIOverviewTool(mcpServer);
  getSymbolsTool(mcpServer);
  getSymbolDetailTool(mcpServer);
  getDesignTokensTool(mcpServer);
  getDesignTokenDetailTool(mcpServer);
  getComponentsTool(mcpServer);
  getComponentDetailTool(mcpServer);
  getSearchSerendieGuidelineTool(mcpServer);

  // Add a simple health check tool
  mcpServer.registerTool(
    "health-check",
    {
      title: "Health Check",
      description: "Check if the MCP server is running",
      inputSchema: {},
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "ok",
              server: "serendie-mcp-server",
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      };
    }
  );

  // Register HTML template as MCP resource for OpenAI Apps SDK
  mcpServer.registerResource(
    "component-preview-widget",
    "ui://serendie/component-preview.html",
    {},
    async () => {
      // Use Vite's ?raw import to load preview HTML
      // This works in Cloudflare Workers without fs module
      return {
        contents: [
          {
            uri: "ui://serendie/component-preview.html",
            mimeType: "text/html+skybridge",
            text: previewHtml,
            _meta: {
              "openai/widgetPrefersBorder": true,
              "openai/widgetDescription":
                "Interactive preview of Serendie UI components with live samples and code examples",
              "openai/widgetDomain":
                "https://add-openai-apps-sdk.serendie-web.pages.dev",
              // CSP configuration for widget security
              "openai/widgetCSP": {
                connect_domains: [
                  "https://add-openai-apps-sdk.serendie-web.pages.dev",
                  "https://dev.serendie-web.pages.dev",
                  "https://serendie.design",
                ],
                resource_domains: [
                  "https://add-openai-apps-sdk.serendie-web.pages.dev",
                  "https://dev.serendie-web.pages.dev",
                  "https://serendie.design",
                ],
              },
            },
          },
        ],
      };
    }
  );

  return mcpServer;
}
