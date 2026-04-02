import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  GetSerendieUIOverviewToolSchema,
  loadSerendieUIOverviewMarkdown,
} from "../schemas/serendie-ui-overview";

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
        "IMPORTANT: This tool is intended for AI agents that do not support Agent Skills. " +
        "If the `/serendie-overview` Skill has already been triggered, do NOT use this tool. " +
        "Otherwise, this should be the very first tool called for any Serendie-related development. " +
        "Provides essential knowledge about Serendie Design System (@serendie/ui, @serendie/symbols, @serendie/design-token), " +
        "including overview, setup instructions, and design token usage. " +
        "Use for any Serendie-related questions such as component/icon usage and design token selection. " +
        "The response is formatted as Markdown for direct consumption by LLMs.",
      inputSchema: {},
      outputSchema: GetSerendieUIOverviewToolSchema.shape,
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
          structuredContent: { text: markdown },
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
          structuredContent: {
            error: "Failed to load Serendie UI overview",
            message,
          },
          isError: true,
        };
      }
    }
  );
}
