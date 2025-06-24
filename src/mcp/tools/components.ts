import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  GetComponentsResponseSchema,
  GetComponentDetailResponseSchema,
  type GetComponentsResponse,
  type GetComponentDetailResponse,
} from "../schemas/components.js";
// ビルド時に生成されるマニフェストを静的インポート
import componentsManifest from "../data/components-manifest.json";

// コンポーネントマニフェストのインターフェース
interface ComponentManifest {
  name: string;
  displayName: string;
  description: string;
  category: string;
  hasDocumentation: boolean;
  source: "auto-detected" | "mdx";
  lastUpdated: string;
  props: PropDefinition[];
  examples: ComponentExample[];
  storybookUrls: StorybookUrl[];
  relatedComponents: string[];
}

interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  description?: string;
}

interface ComponentExample {
  title: string;
  description: string;
  code: string;
  fileName: string;
  language: "tsx" | "jsx";
}

interface StorybookUrl {
  title: string;
  path: string;
  variant?: string;
}

// 静的にインポートしたマニフェストを使用
const manifestData: ComponentManifest[] =
  componentsManifest as ComponentManifest[];

/**
 * Serendie UIコンポーネントの一覧を取得するMCPツール
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * // 全てのコンポーネントを取得
 * const result = await tool.call({});
 *
 * @example
 * // "Button"を含むコンポーネントを検索
 * const result = await tool.call({ search: "Button" });
 *
 * @example
 * // Actionsカテゴリのコンポーネントのみを取得
 * const result = await tool.call({ category: "Actions" });
 *
 * @returns 以下の構造のJSONデータを返します：
 * ```json
 * {
 *   "total": 27,          // 全コンポーネント数
 *   "filtered": 5,        // フィルタリング後の数
 *   "categories": ["Actions", "Inputs", ...],  // カテゴリ一覧
 *   "components": [{
 *     "name": "Button",
 *     "displayName": "ボタン",
 *     "description": "アクションをトリガーするためのクリック可能なコンポーネント",
 *     "category": "Actions"
 *   }]
 * }
 * ```
 */
export function getComponentsTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-components",
    {
      title: "Get Components List",
      description:
        "Get a list of Serendie UI components with optional filtering",
      inputSchema: {
        /**
         * コンポーネント名でフィルタリングするための検索クエリ（オプション）
         * 部分一致で検索され、大文字小文字は区別されません
         * @example "Button", "Text", "Modal"
         */
        search: z
          .string()
          .optional()
          .describe("Optional search query to filter components by name"),
        /**
         * カテゴリでフィルタリング（オプション）
         * @example "Actions", "Inputs", "Layout"
         */
        category: z
          .enum(["Actions", "Inputs", "Layout", "Display", "Feedback"])
          .optional()
          .describe("Filter components by category"),
        /**
         * 返す結果の最大数（オプション）
         * 指定しない場合は全ての結果を返します
         * @example 10, 20, 50
         */
        limit: z
          .number()
          .optional()
          .describe("Maximum number of results to return (default: all)"),
      },
    },
    async ({ search, category, limit }) => {
      try {
        const components = manifestData;

        // コンポーネントをフィルタリング
        let filteredComponents = [...components];

        // カテゴリでフィルタリング
        if (category) {
          filteredComponents = filteredComponents.filter(
            (component) => component.category === category
          );
        }

        // 検索クエリでフィルタリング
        if (search) {
          const searchLower = search.toLowerCase();
          filteredComponents = filteredComponents.filter(
            (component) =>
              component.name.toLowerCase().includes(searchLower) ||
              component.displayName.toLowerCase().includes(searchLower) ||
              component.description.toLowerCase().includes(searchLower)
          );
        }

        // 結果数の制限を適用
        const totalFiltered = filteredComponents.length;
        if (limit && limit > 0) {
          filteredComponents = filteredComponents.slice(0, limit);
        }

        // カテゴリ一覧を取得
        const categories = [
          ...new Set(components.map((c) => c.category)),
        ].sort();

        // サマリー情報のみを返す
        const componentsSummary = filteredComponents.map((component) => ({
          name: component.name,
          displayName: component.displayName,
          description: component.description,
          category: component.category,
          relatedComponents: component.relatedComponents || [],
        }));

        // レスポンスデータを準備
        const responseData: GetComponentsResponse = {
          /**
           * 全コンポーネント数
           */
          total: components.length,
          /**
           * フィルタリング後のコンポーネント数
           */
          filtered: totalFiltered,
          /**
           * 返されたコンポーネント数（limit適用後）
           */
          returned: componentsSummary.length,
          /**
           * 利用可能なカテゴリ一覧
           */
          categories,
          /**
           * コンポーネントの配列
           */
          components: componentsSummary,
        };

        // スキーマで検証
        const validatedResponse =
          GetComponentsResponseSchema.parse(responseData);

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
                error: "Failed to fetch components",
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

/**
 * 特定のSerendie UIコンポーネントの詳細情報を取得するMCPツール
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * // Buttonコンポーネントの詳細を取得
 * const result = await tool.call({ name: "Button" });
 *
 * @returns 以下の構造のJSONデータを返します：
 * ```json
 * {
 *   "name": "Button",
 *   "exists": true,
 *   "displayName": "ボタン",
 *   "description": "アクションをトリガーするためのクリック可能なコンポーネント",
 *   "category": "Actions",
 *   "lastUpdated": "2024-11-01",
 *   "importStatement": "import { Button } from \"@serendie/ui/button\";",
 *   "props": [{
 *     "name": "variant",
 *     "type": "'solid' | 'outline' | 'ghost' | 'link'",
 *     "required": false,
 *     "defaultValue": "solid",
 *     "description": "ボタンの表示スタイル"
 *   }],
 *   "examples": [{
 *     "title": "サイズ",
 *     "description": "SmallとMediumの2種類があります...",
 *     "code": "...",
 *     "fileName": "SizeSample.tsx"
 *   }],
 *   "documentationUrl": "https://serendie.design/components/button",
 *   "storybookUrls": [{
 *     "title": "Medium",
 *     "path": "/story/components-button--medium",
 *     "fullPath": "https://storybook.serendie.design/story/components-button--medium"
 *   }],
 *   "usage": {
 *     "basic": "<Button>Click me</Button>",
 *     "withProps": "<Button variant=\"outline\" size=\"sm\">Click me</Button>"
 *   },
 *   "relatedComponents": [{
 *     "name": "IconButton",
 *     "displayName": "アイコンボタン",
 *     "description": "アイコンのみを含むボタンコンポーネント",
 *     "hasDocumentation": true
 *   }]
 * }
 * ```
 *
 * コンポーネントが存在しない場合：
 * ```json
 * {
 *   "name": "InvalidComponent",
 *   "exists": false,
 *   "message": "Component 'InvalidComponent' not found in components manifest"
 * }
 * ```
 */
export function getComponentDetailTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-component-detail",
    {
      title: "Get Component Detail",
      description:
        "Get detailed information about a specific Serendie UI component including props and usage examples",
      inputSchema: {
        /**
         * 詳細を取得したいコンポーネント名（必須）
         * @example "Button", "TextField", "Modal"
         */
        name: z
          .string()
          .describe("The name of the component to get details for"),
      },
    },
    async ({ name }) => {
      try {
        const components = manifestData;

        // コンポーネントを検索
        const component = components.find((c) => c.name === name);

        if (!component) {
          const notFoundResponse: GetComponentDetailResponse = {
            name,
            exists: false,
            message: `Component '${name}' not found in components manifest`,
          };

          // スキーマで検証
          const validatedResponse =
            GetComponentDetailResponseSchema.parse(notFoundResponse);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(validatedResponse, null, 2),
              },
            ],
          };
        }

        // インポート文を生成（動的に生成）
        const importPath = `@serendie/ui/${component.name
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()
          .replace(/^-/, "")}`;
        const importStatement = `import { ${component.name} } from "${importPath}";`;

        // 使用例を生成
        const usage: { basic: string; withProps?: string } = {
          basic: `<${component.name}>Content</${component.name}>`,
        };

        // Propsがある場合の使用例
        if (component.props.length > 0) {
          const propsExample = component.props
            .filter((prop) => !prop.required && prop.name !== "children")
            .slice(0, 2)
            .map((prop) => {
              if (prop.type.includes("|")) {
                // Union型の最初の値を使用
                const firstValue = prop.type
                  .split("|")[0]
                  .trim()
                  .replace(/['"]/g, "");
                return `${prop.name}="${firstValue}"`;
              } else if (prop.type === "boolean") {
                return prop.name;
              } else {
                return `${prop.name}="value"`;
              }
            })
            .join(" ");

          if (propsExample) {
            usage.withProps = `<${component.name} ${propsExample}>Content</${component.name}>`;
          }
        }

        // Storybook URLをフルパスに変換
        const storybookUrlsWithFullPath = component.storybookUrls.map(
          (url) => ({
            ...url,
            fullPath: `https://storybook.serendie.design${url.path}`,
          })
        );

        // ドキュメントURLを生成（MDXファイルがある場合）
        const documentationUrl = component.hasDocumentation
          ? `https://serendie.design/components/${component.name
              .replace(/([A-Z])/g, "-$1")
              .toLowerCase()
              .replace(/^-/, "")}`
          : null;

        // 詳細情報を構築
        const componentDetail: GetComponentDetailResponse = {
          /**
           * コンポーネント名
           */
          name: component.name,
          /**
           * コンポーネントが存在するかどうか
           */
          exists: true as const,
          /**
           * 表示名（日本語）
           */
          displayName: component.displayName,
          /**
           * コンポーネントの説明
           */
          description: component.description,
          /**
           * カテゴリ
           */
          category: component.category,
          /**
           * 最終更新日
           */
          lastUpdated: component.lastUpdated,
          /**
           * ドキュメントURL（存在する場合）
           */
          documentationUrl,
          /**
           * インポート文
           */
          importStatement,
          /**
           * Props定義
           */
          props: component.props,
          /**
           * 使用例（コードサンプル）
           */
          examples: component.examples,
          /**
           * Storybook URL（フルパス付き）
           */
          storybookUrls: storybookUrlsWithFullPath,
          /**
           * 基本的な使用方法
           */
          usage,
          /**
           * 関連コンポーネント
           */
          relatedComponents: component.relatedComponents || [],
        };

        // スキーマで検証
        const validatedResponse =
          GetComponentDetailResponseSchema.parse(componentDetail);

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
                error: "Failed to fetch component detail",
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
