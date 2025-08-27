import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  SerendieUIDetailRequestSchema,
  SerendieUIDetailResponseSchema,
  type SerendieUIDetailResponse,
} from "../schemas/serendie-ui-detail.js";
import {
  getSectionDetail,
  getNextSection,
  getSectionProgress,
  type SectionId,
} from "../data/serendie-ui-sections.js";

/**
 * @serendie/uiデザインシステムの詳細情報を提供するMCPツール
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * // 特定セクションの詳細を取得
 * const result = await tool.call({ section: "architecture" });
 *
 * @returns 以下の構造のJSONデータを返します：
 * ```json
 * {
 *   "section": "architecture",
 *   "title": "アーキテクチャ",
 *   "progress": "1/12",
 *   "content": { ... },
 *   "nextStep": {
 *     "message": "次のセクションに進む",
 *     "command": "get-serendie-ui-detail({ section: 'import-patterns' })"
 *   }
 * }
 * ```
 */
export function getSerendieUIDetailTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-serendie-ui-detail",
    {
      title: "Get Serendie UI Detail",
      description:
        "Get detailed information about a specific section of the Serendie UI design system. " +
        "Use this after get-serendie-ui-overview to dive deeper into specific topics.",
      inputSchema: {
        section: z
          .enum([
            "architecture",
            "import-patterns",
            "styling-approach",
            "design-tokens",
            "component-categories",
            "common-patterns",
            "initial-setup",
            "package-relationships",
            "figma-integration",
            "component-defaults",
            "practical-examples",
            "best-practices",
          ])
          .describe("The section ID to get details for"),
      },
    },
    async (params) => {
      try {
        // パラメータをバリデーション
        const validatedRequest = SerendieUIDetailRequestSchema.parse(params);
        const sectionId = validatedRequest.section as SectionId;

        // セクション詳細を取得
        const sectionDetail = getSectionDetail(sectionId);
        if (!sectionDetail) {
          throw new Error(`Section not found: ${sectionId}`);
        }

        // 次のセクションを取得
        const nextSectionId = getNextSection(sectionId);
        const progress = getSectionProgress(sectionId);

        // レスポンスを構築
        const responseData: SerendieUIDetailResponse = {
          section: sectionId,
          title: sectionDetail.title,
          progress: progress,
          content: sectionDetail.content,
        };

        // 次のステップがある場合は追加
        if (nextSectionId) {
          responseData.nextStep = {
            message: "次のセクションに進む",
            command: `get-serendie-ui-detail({ section: '${nextSectionId}' })`,
          };
        } else {
          responseData.nextStep = {
            message: "ウォークスルー完了！作業を開始できます",
            command: "必要に応じて個別のMCPツールを使用してください",
          };
        }

        // スキーマで検証
        const validatedResponse =
          SerendieUIDetailResponseSchema.parse(responseData);

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
                error: "Failed to get Serendie UI detail",
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
