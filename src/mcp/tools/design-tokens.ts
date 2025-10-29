import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import tokens from "@serendie/design-token/token-list";
import {
  TokenTypeSchema,
  TokenCategorySchema,
  ThemeSchema,
  GetDesignTokensResponseSchema,
  GetDesignTokenDetailResponseSchema,
  type GetDesignTokensResponse,
  type GetDesignTokenDetailResponse,
  type TokenCategory,
  type TokenType,
} from "../schemas/design-tokens.js";

/**
 * Serendie Design Systemのデザイントークン一覧を取得するMCPツール
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * // 全てのデザイントークンを取得
 * const result = await tool.call({});
 *
 * @example
 * // カラートークンのみを取得
 * const result = await tool.call({ type: "color" });
 *
 * @example
 * // システムトークンのみを取得
 * const result = await tool.call({ category: "system" });
 *
 * @returns 以下の構造のJSONデータを返します：
 * ```json
 * {
 *   "total": 1234,        // 全トークン数
 *   "filtered": 50,       // フィルタリング後の数
 *   "types": ["color", "typography", ...],  // 見つかったタイプ一覧
 *   "tokens": [{
 *     "key": "sd.reference.color.scale.gray.100",
 *     "path": ["sd", "reference", "color", "scale", "gray", "100"],
 *     "type": "color",
 *     "value": "#FAFAFA",
 *     "originalValue": "#FAFAFA",
 *     "category": "reference",
 *     "theme": null
 *   }]
 * }
 * ```
 */
export function getDesignTokensTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-design-tokens",
    {
      title: "Get Design Tokens List",
      description:
        "Get a list of Serendie design tokens with optional filtering by type, category, or theme",
      inputSchema: {
        /**
         * トークンタイプでフィルタリング（オプション）
         * Available types: "color", "dimension", "fontFamily", "fontWeight", "number", "shadow", "typography"
         * @example "color", "typography", "dimension"
         */
        type: TokenTypeSchema.optional().describe("Filter tokens by type"),
        /**
         * トークンカテゴリでフィルタリング（オプション）
         * reference: 生の値を持つトークン
         * system: リファレンストークンを参照するトークン
         */
        category: TokenCategorySchema.optional().describe(
          "Filter tokens by category (reference or system)"
        ),
        /**
         * 返す結果の最大数（オプション）
         * 指定しない場合は全ての結果を返します
         * @example 10, 20, 50
         */
        limit: z
          .number()
          .optional()
          .describe("Maximum number of results to return (default: all)"),
        /**
         * 特定のテーマでフィルタリング（オプション）
         * @example "asagi", "konjo"
         */
        theme: ThemeSchema.optional().describe("Filter tokens by theme"),
      },
      outputSchema: GetDesignTokensResponseSchema.shape,
    },
    async ({ type, category, theme, limit }) => {
      try {
        // トークンをフィルタリング
        let filteredTokens = [...tokens];

        // カテゴリでフィルタリング
        if (category) {
          filteredTokens = filteredTokens.filter((token) => {
            if (category === "reference") {
              return token.key.includes("sd.reference");
            } else if (category === "system") {
              return (
                token.key.includes("sd.system") && !token.key.includes("themes")
              );
            }
            return false;
          });
        }

        // タイプでフィルタリング
        if (type) {
          filteredTokens = filteredTokens.filter(
            (token) => token.type === type
          );
        }

        // テーマでフィルタリング
        if (theme) {
          filteredTokens = filteredTokens.filter((token) =>
            token.key.includes(`themes.${theme}`)
          );
        }

        // 結果数の制限を適用
        const totalFiltered = filteredTokens.length;
        if (limit && limit > 0) {
          filteredTokens = filteredTokens.slice(0, limit);
        }

        // トークンデータを整形
        const formattedTokens = filteredTokens.map((token) => {
          // カテゴリを判定
          let tokenCategory: TokenCategory = "system";
          if (token.key.includes("sd.reference")) {
            tokenCategory = "reference";
          } else if (token.key.includes("themes")) {
            tokenCategory = "theme";
          }

          // テーマを抽出
          let tokenTheme: string | null = null;
          const themeMatch = token.key.match(/themes\.(\w+)\./);
          if (themeMatch) {
            tokenTheme = themeMatch[1];
          }

          return {
            key: token.key,
            path: token.path,
            type: token.type as TokenType,
            value: token.value,
            originalValue: token.originalValue,
            category: tokenCategory,
            theme: tokenTheme,
          };
        });

        // 見つかったタイプ一覧を取得
        const types = [...new Set(formattedTokens.map((token) => token.type))];

        // レスポンスデータを準備
        const tokenData: GetDesignTokensResponse = {
          /**
           * @serendie/design-token パッケージに含まれる全トークン数
           */
          total: tokens.length,
          /**
           * フィルタリング後のトークン数
           */
          filtered: totalFiltered,
          /**
           * 返されたトークン数（limit適用後）
           */
          returned: formattedTokens.length,
          /**
           * 見つかったトークンタイプ一覧
           */
          types: types.sort(),
          /**
           * トークンの配列
           */
          tokens: formattedTokens,
        };

        // スキーマで検証
        const validatedResponse =
          GetDesignTokensResponseSchema.parse(tokenData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(validatedResponse, null, 2),
            },
          ],
          structuredContent: validatedResponse,
        };
      } catch (error) {
        /**
         * エラー時のレスポンス
         * 主に@serendie/design-tokenパッケージの読み込みエラーなど
         */
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "Failed to fetch design tokens",
                message:
                  error instanceof Error ? error.message : "Unknown error",
              }),
            },
          ],
          structuredContent: {
            error: "Failed to fetch design tokens",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          isError: true,
        };
      }
    }
  );
}

/**
 * 特定のデザイントークンの詳細情報を取得するMCPツール
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * // 特定のトークンの詳細を取得
 * const result = await tool.call({ key: "sd.system.color.impression.primaryContainer" });
 *
 * @returns 以下の構造のJSONデータを返します：
 * ```json
 * {
 *   "key": "sd.system.color.impression.primaryContainer",
 *   "exists": true,
 *   "path": ["sd", "system", "color", "impression", "primaryContainer"],
 *   "type": "color",
 *   "value": "#0A69CF",
 *   "originalValue": "{sd.reference.color.scale.blue.500}",
 *   "category": "system",
 *   "theme": null,
 *   "cssVariable": "var(--sd-system-color-impression-primaryContainer)",
 *   "usage": {
 *     "css": "background-color: var(--sd-system-color-impression-primaryContainer);",
 *     "pandacss": "bgColor: 'sd.system.color.impression.primaryContainer'"
 *   }
 * }
 * ```
 *
 * トークンが存在しない場合：
 * ```json
 * {
 *   "key": "invalid.token",
 *   "exists": false,
 *   "message": "Token 'invalid.token' not found in @serendie/design-token"
 * }
 * ```
 */
export function getDesignTokenDetailTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-design-token-detail",
    {
      title: "Get Design Token Detail",
      description:
        "Get detailed information about a specific design token including usage examples",
      inputSchema: {
        /**
         * 詳細を取得したいトークンのキー（必須）
         * @example "sd.system.color.impression.primaryContainer"
         */
        key: z.string().describe("The key of the token to get details for"),
      },
      outputSchema: GetDesignTokenDetailResponseSchema.shape,
    },
    async ({ key }) => {
      try {
        // トークンを検索
        const token = tokens.find((t) => t.key === key);

        if (!token) {
          const notFoundResponse: GetDesignTokenDetailResponse = {
            key,
            exists: false,
            message: `Token '${key}' not found in @serendie/design-token`,
          };

          // スキーマで検証
          const validatedResponse =
            GetDesignTokenDetailResponseSchema.parse(notFoundResponse);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(validatedResponse, null, 2),
              },
            ],
            structuredContent: validatedResponse,
          };
        }

        // カテゴリを判定
        let category: TokenCategory = "system";
        if (token.key.includes("sd.reference")) {
          category = "reference";
        } else if (token.key.includes("themes")) {
          category = "theme";
        }

        // テーマを抽出
        let theme: string | null = null;
        const themeMatch = token.key.match(/themes\.(\w+)\./);
        if (themeMatch) {
          theme = themeMatch[1];
        }

        // CSS変数名を生成
        const cssVariable = `var(--${token.key.replace(/\./g, "-")})`;

        // 使用例を生成
        const usage: { css: string; pandacss: string } = {
          css: "",
          pandacss: "",
        };

        switch (token.type) {
          case "color":
            usage.css = `color: ${cssVariable};`;
            usage.pandacss = `color: '${token.key}'`;
            break;
          case "typography":
            // Typography tokens have composite values, so we apply them as a mixin
            usage.css = `/* Apply typography token as CSS variables */\nfont-size: var(--${token.key.replace(/\./g, "-")}-fontSize);\nfont-weight: var(--${token.key.replace(/\./g, "-")}-fontWeight);\nfont-family: var(--${token.key.replace(/\./g, "-")}-fontFamily);\nline-height: var(--${token.key.replace(/\./g, "-")}-lineHeight);`;
            usage.pandacss = `textStyle: '${token.key}'`;
            break;
          case "dimension":
            usage.css = `width: ${cssVariable};`;
            usage.pandacss = `width: '${token.key}'`;
            break;
          case "fontFamily":
            usage.css = `font-family: ${cssVariable};`;
            usage.pandacss = `fontFamily: '${token.key}'`;
            break;
          case "fontWeight":
            usage.css = `font-weight: ${cssVariable};`;
            usage.pandacss = `fontWeight: '${token.key}'`;
            break;
          case "number":
            // Number tokens are typically used for opacity or other numeric properties
            usage.css = `opacity: ${cssVariable};`;
            usage.pandacss = `opacity: '${token.key}'`;
            break;
          case "shadow":
            // Shadow tokens have composite values
            usage.css = `box-shadow: ${cssVariable};`;
            usage.pandacss = `boxShadow: '${token.key}'`;
            break;
        }

        // トークンの詳細情報
        const tokenDetail: GetDesignTokenDetailResponse = {
          /**
           * トークンキー
           */
          key: token.key,
          /**
           * トークンが存在するかどうか
           */
          exists: true as const,
          /**
           * トークンのパス配列
           */
          path: token.path,
          /**
           * トークンタイプ
           */
          type: token.type as TokenType,
          /**
           * 実際の値
           */
          value: token.value,
          /**
           * 元の値（リファレンス含む）
           */
          originalValue: token.originalValue,
          /**
           * トークンカテゴリ
           */
          category,
          /**
           * テーマ（テーマ固有トークンの場合）
           */
          theme,
          /**
           * CSS変数形式
           */
          cssVariable,
          /**
           * 使用例
           */
          usage,
          /**
           * リファレンス情報（システムトークンの場合）
           */
          references:
            typeof token.originalValue === "string" &&
            token.originalValue.startsWith("{") &&
            token.originalValue.endsWith("}")
              ? token.originalValue.slice(1, -1)
              : null,
        };

        // スキーマで検証
        const validatedResponse =
          GetDesignTokenDetailResponseSchema.parse(tokenDetail);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(validatedResponse, null, 2),
            },
          ],
          structuredContent: validatedResponse,
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
                error: "Failed to fetch token detail",
                message:
                  error instanceof Error ? error.message : "Unknown error",
              }),
            },
          ],
          structuredContent: {
            error: "Failed to fetch token detail",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          isError: true,
        };
      }
    }
  );
}
