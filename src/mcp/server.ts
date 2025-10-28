import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getSymbolsTool, getSymbolDetailTool } from "./tools/symbols";
import {
  getDesignTokensTool,
  getDesignTokenDetailTool,
} from "./tools/design-tokens";
import { getComponentsTool, getComponentDetailTool } from "./tools/components";
import { getSerendieUIOverviewTool } from "./tools/serendie-ui-overview";
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

  return mcpServer;
}
