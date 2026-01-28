import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
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

// MCP Apps resource URI
const PREVIEW_RESOURCE_URI = "ui://serendie/component-preview.html";

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

  // Register HTML template as MCP Apps resource
  // Uses @modelcontextprotocol/ext-apps for standard MCP Apps format
  // Note: Since the UI is bundled into a single HTML file using vite-plugin-singlefile,
  // we don't need external CSP domains. All assets are inlined.
  registerAppResource(
    mcpServer,
    "Serendie Component Preview",
    PREVIEW_RESOURCE_URI,
    { description: "Interactive preview of Serendie UI components" },
    async () => {
      // Use Vite's ?raw import to load preview HTML
      // This works in Cloudflare Workers without fs module
      return {
        contents: [
          {
            uri: PREVIEW_RESOURCE_URI,
            mimeType: RESOURCE_MIME_TYPE,
            text: previewHtml,
          },
        ],
      };
    }
  );

  return mcpServer;
}
