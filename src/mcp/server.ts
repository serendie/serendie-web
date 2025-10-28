import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getSymbolsTool, getSymbolDetailTool } from "./tools/symbols";
import {
  getDesignTokensTool,
  getDesignTokenDetailTool,
} from "./tools/design-tokens";
import { getComponentsTool, getComponentDetailTool } from "./tools/components";
import { getSerendieUIOverviewTool } from "./tools/serendie-ui-overview";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      // Load the pre-built preview.html from dist/mcp/ui/
      const previewHtmlPath = join(__dirname, "../../dist/mcp/ui/preview.html");
      let htmlContent = "";

      try {
        htmlContent = await readFile(previewHtmlPath, "utf-8");
      } catch (error) {
        console.error(
          "[MCP] Failed to load preview.html. Please run 'npm run build:preview' first.",
          error
        );
        // Fallback: return an error message in HTML
        htmlContent = `<!DOCTYPE html>
<html>
<head><title>Preview Not Built</title></head>
<body>
  <h1>Preview HTML Not Found</h1>
  <p>Please run <code>npm run build:preview</code> to generate the preview HTML.</p>
  <p>Path: ${previewHtmlPath}</p>
</body>
</html>`;
      }

      return {
        contents: [
          {
            uri: "ui://serendie/component-preview.html",
            mimeType: "text/html+skybridge",
            text: htmlContent,
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
