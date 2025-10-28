import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadSerendieUIOverviewMarkdown } from "../schemas/serendie-ui-overview";

/**
 * @serendie/uiデザインシステムの前提知識をMarkdownで提供するMCPツール。
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * const result = await tool.call({});
 *
 * @returns Markdownコンテンツを`text`タイプで返却します。
 */
export function getSerendieUIOverviewTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-serendie-ui-overview",
    {
      title: "Get Serendie UI Overview",
      description:
        "IMPORTANT: You MUST call this tool FIRST before any Serendie-related development. " +
        "This provides critical prerequisite knowledge about @serendie/ui design system. " +
        "Always use this tool at the beginning of any conversation about Serendie to avoid common mistakes " +
        "like adding reset CSS (already included) or using px values instead of design tokens. " +
        "The response is formatted as Markdown for direct consumption by LLMs.",
      inputSchema: {},
    },
    async () => {
      try {
        const markdown = await loadSerendieUIOverviewMarkdown();

        return {
          content: [
            {
              type: "text",
              text: markdown,
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        return {
          content: [
            {
              type: "text",
              text: `Failed to load Serendie UI overview. ${message}`,
            },
          ],
        };
      }
    }
  );
}
