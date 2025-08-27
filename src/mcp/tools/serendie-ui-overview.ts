import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  SerendieUIOverviewResponseSchema,
  type SerendieUIOverviewResponse,
} from "../schemas/serendie-ui-overview";
import {
  SECTION_SUMMARIES,
  getContextualHelp,
} from "../data/serendie-ui-sections";

/**
 * @serendie/uiデザインシステムの概要を提供するMCPツール（軽量版）
 * 詳細情報はget-serendie-ui-detailツールで取得
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * // 概要を取得
 * const result = await tool.call({});
 *
 * @returns 以下の構造のJSONデータを返します：
 * ```json
 * {
 *   "overview": "@serendie/uiの短い概要",
 *   "version": "1.0.1",
 *   "sections": [...],
 *   "contextualHelp": { ... },
 *   "nextStep": {
 *     "message": "次のコマンドを実行して詳細を確認してください",
 *     "command": "get-serendie-ui-detail({ section: 'architecture' })"
 *   }
 * }
 * ```
 */
export function getSerendieUIOverviewTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-serendie-ui-overview",
    {
      title: "Get Serendie UI Overview",
      description:
        "IMPORTANT: You MUST call this tool FIRST before any Serendie-related development. " +
        "This provides a lightweight overview of the @serendie/ui design system. " +
        "Use get-serendie-ui-detail for detailed information about specific sections.",
      inputSchema: {}, // パラメータなし
    },
    async () => {
      try {
        const overviewData: SerendieUIOverviewResponse = {
          overview:
            "@serendie/uiは三菱電機のReactベースデザインシステム。PandaCSS統合済み。詳細は各セクションをget-serendie-ui-detailツールで確認。",
          version: "1.0.1",
          sections: SECTION_SUMMARIES,
          contextualHelp: getContextualHelp(),
          nextStep: {
            message: "次のコマンドを実行して詳細を確認してください",
            command: "get-serendie-ui-detail({ section: 'architecture' })",
          },
        };

        // スキーマで検証
        const validatedResponse =
          SerendieUIOverviewResponseSchema.parse(overviewData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(validatedResponse, null, 2),
            },
          ],
        };
      } catch (error) {
        /**
         * エラー時のレスポンス
         */
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "Failed to generate Serendie UI overview",
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
