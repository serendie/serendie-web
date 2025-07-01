import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  SerendieUIOverviewResponseSchema,
  type SerendieUIOverviewResponse,
} from "../schemas/serendie-ui-overview.js";
import { getCategoryDescriptions } from "../data/component-categories.js";

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
          componentCategories: getCategoryDescriptions(),
          importPatterns: {
            component: {
              pattern: "import { ComponentName } from '@serendie/ui'",
              example: "import { Button } from '@serendie/ui'",
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
            patterns: ["css()", "sva()", "textStyle"],
            tokens: "styled-system経由",
            example:
              "css({ p: 'sd.system.dimension.spacing.medium', color: 'sd.system.color.impression.primary' })",
            textStyles:
              "textStyle: 'sd.system.typography.headline.small_expanded' でtypographyトークンを適用",
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
            github: "https://github.com/serendie/serendie",
            figma:
              "https://www.figma.com/community/file/1433690846108785966/serendie-ui-kit",
          },
          bestPractices: [
            "デザイントークンを必ず使用（特にスペーシング）",
            "px値の直接指定は禁止",
            "リセットCSSは追加しない（含まれている）",
            "@serendie/ui、@serendie/design-token、@serendie/symbols を使用",
            "Figma Variablesと自動同期",
            "詳細はMCPツールで確認",
            "デザイントークン選択時は必ずget-design-tokensツールを活用して利用可能なトークンを確認",
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
            importance: "必須。px値禁止。リファレンストークン直接使用禁止。",
            tokenTypes: {
              reference: "生の値（color.scale.green.500等）。直接使用禁止。",
              system:
                "リファレンスを参照（color.impression.primary等）。必ずこちらを使用。",
            },
            priority: [
              "必ずシステムトークンを使用（sd.system.で始まるトークン）",
              "リファレンストークン（sd.reference.）の直接使用は禁止",
              "スペーシング: 必ずsd.system.dimension.spacing.*トークンを使用 (px値や数値の直接指定禁止)",
              "色: color: 'sd.system.color.impression.primary' (HEX禁止)",
            ],
            commonMistakes: [
              "padding: '16px' → p: 'sd.system.dimension.spacing.*' (適切なトークンを使用)",
              "color: '#333' → color: 'sd.system.color.component.onSurface'",
              "color: 'sd.reference.color.scale.gray.500' → color: 'sd.system.color.text.primary'",
              "margin: 8 → m: 'sd.system.dimension.spacing.*' (適切なトークンを使用)",
            ],
            examples: {
              correct: {
                good: "css({ p: 'sd.system.dimension.spacing.medium', color: 'sd.system.color.component.onSurface' })",
                bad: "css({ padding: '16px', color: '#333' })",
                veryBad:
                  "css({ color: 'sd.reference.color.scale.gray.500' }) // リファレンス直接使用NG",
              },
            },
            spacingMapping: {
              overview:
                "スペーシングにはsd.system.dimension.spacingトークンを使用",
              guideline: [
                "数値の直接指定は禁止（px値、数値など）",
                "必ずsd.system.dimension.spacing.* トークンを使用",
                "具体的なトークン一覧と値はget-design-tokensツールで確認",
                "type: 'dimension', category: 'system'でフィルタ可能",
                "MCPツールを活用例: get-design-tokens({ type: 'dimension', category: 'system' })",
              ],
              usage: "p: 'sd.system.dimension.spacing.medium' // paddingの例",
              examples: [
                "gap: 'sd.system.dimension.spacing.large'",
                "m: 'sd.system.dimension.spacing.extraSmall'",
                "py: 'sd.system.dimension.spacing.small'",
              ],
            },
          },
          figmaIntegration: {
            overview: "Figma Variables ←→ design-token自動同期",
            figmaVariables: "デザイントークン自動更新",
            codeConnect: "実装コード直接参照可能",
            workflow: [],
          },
          componentDefaults: {
            overview: "コンポーネントのデフォルトスタイル情報",
            components: {
              TextField: {
                defaults: ["maxWidthのデフォルト値が設定されている"],
                override: "classNameにてwidth: '100%'指定で制限を解除",
              },
              PasswordField: {
                defaults: ["maxWidthのデフォルト値が設定されている"],
                override: "classNameにてwidth: '100%'指定で制限を解除",
              },
            },
          },
          practicalExamples: {
            overview: "実践的なコンポーネントの組み合わせ例",
            examples: [
              {
                title: "ログインフォームの実装",
                description: "ユーザー名とパスワードの入力フォーム",
                code: `<Stack gap="sd.system.dimension.spacing.large">
  <TextField label="ユーザー名" width="100%" />
  <PasswordField label="パスワード" width="100%" />
  <Button width="100%" variant="solid" colorScheme="primary">
    ログイン
  </Button>
</Stack>`,
                notes: [
                  "Stackで垂直方向のレイアウト",
                  "width: '100%'でフィールドのmaxWidth制限を解除",
                  "スペーシングはデザイントークンを使用",
                ],
              },
              {
                title: "レスポンシブカードレイアウト",
                description: "Gridを使用したカードのグリッド表示",
                code: `<Grid 
  templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
  gap="sd.system.dimension.spacing.extraLarge"
>
  {items.map(item => (
    <Card key={item.id} p="sd.system.dimension.spacing.large">
      <Text textStyle="sd.system.typography.headline.small_expanded">
        {item.title}
      </Text>
      <Text color="sd.system.color.text.secondary">
        {item.description}
      </Text>
    </Card>
  ))}
</Grid>`,
                notes: [
                  "Gridでレスポンシブなカードレイアウト",
                  "textStyleでtypographyトークンを適用",
                  "スペーシングと色は必ずデザイントークンを使用",
                ],
              },
            ],
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
