import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  SerendieUIOverviewResponseSchema,
  type SerendieUIOverviewResponse,
} from "../schemas/serendie-ui-overview.js";

/**
 * @serendie/uiデザインシステムの前提知識を提供するMCPツール
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * // 前提知識を取得
 * const result = await tool.call({});
 *
 * @returns 以下の構造のJSONデータを返します：
 * ```json
 * {
 *   "overview": "@serendie/uiの概要",
 *   "version": "1.0.1",
 *   "architecture": {
 *     "framework": "React 18ベースのコンポーネントライブラリ",
 *     "styling": "PandaCSSを使用",
 *     "dependencies": { ... }
 *   },
 *   "componentCategories": { ... },
 *   "importPatterns": { ... },
 *   "themes": { ... },
 *   "stylingApproach": { ... },
 *   "developmentGuidelines": [...],
 *   "commonPatterns": { ... },
 *   "resources": { ... },
 *   "bestPractices": [...]
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
        "This provides critical prerequisite knowledge about @serendie/ui design system. " +
        "Always use this tool at the beginning of any conversation about Serendie to avoid common mistakes " +
        "like adding reset CSS (already included) or using px values instead of design tokens.",
      inputSchema: {}, // パラメータなし
    },
    async () => {
      try {
        const overviewData: SerendieUIOverviewResponse = {
          overview:
            "@serendie/uiは三菱電機のReactベースデザインシステム。PandaCSS統合済み。",
          version: "1.0.1",
          architecture: {
            framework: "React 18 + PandaCSS",
            styling: "PandaCSS + @serendie/uiプリセット",
            dependencies: {
              "@ark-ui/react": "",
              "@serendie/design-token": "",
              "@serendie/symbols": "",
            },
          },
          componentCategories: {
            Actions: "ボタン、リンク等",
            Inputs: "入力系",
            Layout: "レイアウト系",
            Display: "表示系",
            Feedback: "フィードバック系",
            Other: "その他",
          },
          importPatterns: {
            component: {
              pattern:
                "import { ComponentName } from '@serendie/ui/component-name'",
              example: "import { Button } from '@serendie/ui/button'",
              note: "PascalCase → kebab-case",
            },
            icons: {
              pattern: "import { IconName } from '@serendie/symbols'",
              example: "import { AddIcon } from '@serendie/symbols'",
              variants: ["", "Outlined", "Filled"],
            },
          },
          themes: {
            available: ["asagi", "konjo", "kurikawa", "sumire", "tsutsuji"],
            default: "asagi",
            usage: "PandaCSS設定で指定",
          },
          stylingApproach: {
            method: "PandaCSS",
            patterns: ["css()", "sva()"],
            tokens: "styled-system経由",
            example:
              "css({ p: 4, color: 'sd.system.color.impression.primary' })",
          },
          developmentGuidelines: [
            "デザイントークン必須使用",
            "既存コンポーネント優先",
            "アクセシビリティ考慮",
          ],
          commonPatterns: {
            props: {
              variant: "solid/outline/ghost",
              size: "xs/sm/md/lg/xl",
              colorScheme: "primary/secondary等",
              asChild: "要素置換",
            },
            composition: "Ark UI準拠",
          },
          resources: {
            documentation: "https://serendie.design/",
            storybook: "https://storybook.serendie.design/",
            github: "https://github.com/mi-col/serendie",
            figma: "利用可能",
          },
          bestPractices: [
            "デザイントークンを必ず使用（特にスペーシング）",
            "px値の直接指定は禁止",
            "リセットCSSは追加しない（含まれている）",
            "@serendie/ui、@serendie/design-token、@serendie/symbols を使用",
            "Figma Variablesと自動同期",
            "詳細はMCPツールで確認",
          ],
          initialSetup: {
            overview: "最小限の設定で開始可能",
            steps: [
              "npm install @serendie/ui @serendie/design-token @serendie/symbols",
              "PandaCSS設定に@serendie/uiプリセット追加",
            ],
            warnings: [],
            doNotDo: [
              "リセットCSS追加禁止（含まれている）",
              "box-sizing設定不要",
              "独自スペーシング禁止（design-token使用）",
            ],
          },
          packageRelationships: {
            overview: "3つのパッケージが連携",
            packages: {
              "@serendie/ui": {
                description: "コンポーネント",
                role: "UIコンポーネント提供",
                mcpTool: "get-components",
              },
              "@serendie/design-token": {
                description: "デザイントークン",
                role: "設計値管理",
                mcpTool: "get-design-tokens",
              },
              "@serendie/symbols": {
                description: "アイコン",
                role: "アイコン提供",
                mcpTool: "get-symbols",
              },
            },
            designFlow: "Figma Variables → design-token → UI → App",
          },
          designTokenGuidelines: {
            importance: "必須。px値禁止。",
            priority: [
              "スペーシング: p: 4, gap: 2 (px値禁止)",
              "色: color: 'primary' (HEX禁止)",
            ],
            commonMistakes: [
              "padding: '16px' → p: 4",
              "color: '#333' → color: 'sd.system.color.component.onSurface'",
            ],
            examples: {
              correct: {
                good: "css({ p: 4, color: 'sd.system.color.component.onSurface' })",
                bad: "css({ padding: '16px', color: '#333' })",
              },
            },
          },
          figmaIntegration: {
            overview: "Figma Variables ←→ design-token自動同期",
            figmaVariables: "デザイントークン自動更新",
            codeConnect: "実装コード直接参照可能",
            workflow: [],
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
