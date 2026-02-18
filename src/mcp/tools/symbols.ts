import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v3";
import { symbolNames } from "@serendie/symbols";
import {
  GetSymbolsResponseSchema,
  GetSymbolDetailResponseSchema,
  type GetSymbolsResponse,
  type GetSymbolDetailResponse,
} from "../schemas/symbols.js";
import symbolKeywords from "../data/symbol-keywords.json";

/**
 * Serendie Design Systemのシンボル（アイコン）一覧を取得するMCPツール
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * // 全てのシンボル名を取得
 * const result = await tool.call({});
 *
 * @example
 * // "arrow"を含むシンボルを検索
 * const result = await tool.call({ search: "arrow" });
 *
 * @example
 * // 最初の10個のシンボルのみ取得
 * const result = await tool.call({ limit: 10 });
 *
 * @returns 以下の構造のJSONデータを返します：
 * ```json
 * {
 *   "total": 305,        // 全シンボル数
 *   "filtered": 10,      // フィルタリング後の数
 *   "variants": ["outlined", "filled"],  // 利用可能なバリアント
 *   "symbols": ["activity", "airplay", "alert-circle", ...]  // シンボル名の配列
 * }
 * ```
 */
export function getSymbolsTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-symbols",
    {
      title: "Get Serendie Symbols List",
      description:
        "Get a list of available Serendie symbol names with optional search filtering",
      inputSchema: {
        /**
         * シンボル名または関連キーワードでフィルタリングするための検索クエリ（オプション）
         * 部分一致で検索され、大文字小文字は区別されません
         * @example "arrow", "alert", "zoom", "user", "ユーザー"
         */
        search: z
          .string()
          .optional()
          .describe(
            "Optional search query to filter symbols by name or related keywords"
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
      },
      outputSchema: GetSymbolsResponseSchema.shape,
    },
    async ({ search, limit }) => {
      try {
        // 検索クエリに基づいてシンボルをフィルタリング
        let filteredSymbols = [...symbolNames];

        if (search) {
          const searchLower = search.toLowerCase();

          // シンボル名での検索と関連キーワードでの検索を組み合わせる
          filteredSymbols = filteredSymbols.filter((name) => {
            // シンボル名での部分一致
            if (name.toLowerCase().includes(searchLower)) {
              return true;
            }

            // 関連キーワードでの検索
            const keywords = (symbolKeywords as Record<string, string[]>)[name];
            if (keywords) {
              return keywords.some((keyword) =>
                keyword.toLowerCase().includes(searchLower)
              );
            }

            return false;
          });
        }

        // 結果数の制限を適用
        if (limit && limit > 0) {
          filteredSymbols = filteredSymbols.slice(0, limit);
        }

        // レスポンスデータを準備（軽量版）
        const symbolData: GetSymbolsResponse = {
          /**
           * @serendie/symbols パッケージに含まれる全シンボル数
           * 現在は305個のシンボルが利用可能
           */
          total: symbolNames.length,
          /**
           * フィルタリング後のシンボル数
           * 検索条件やlimit指定により変動
           */
          filtered: filteredSymbols.length,
          /**
           * 全シンボル共通の利用可能なバリアント
           */
          variants: ["outlined", "filled"],
          /**
           * シンボル名の配列（詳細情報は含まない）
           */
          symbols: filteredSymbols,
        };

        // スキーマで検証
        const validatedResponse = GetSymbolsResponseSchema.parse(symbolData);

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
         * 主に@serendie/symbolsパッケージの読み込みエラーなど
         */
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "Failed to fetch symbols",
                message:
                  error instanceof Error ? error.message : "Unknown error",
              }),
            },
          ],
          structuredContent: {
            error: "Failed to fetch symbols",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          isError: true,
        };
      }
    }
  );
}

/**
 * 特定のSerendieシンボルの詳細情報を取得するMCPツール
 *
 * @param mcpServer - MCPサーバーインスタンス
 *
 * @example
 * // "activity"シンボルの詳細を取得
 * const result = await tool.call({ name: "activity" });
 *
 * @returns 以下の構造のJSONデータを返します：
 * ```json
 * {
 *   "name": "activity",
 *   "exists": true,
 *   "variants": ["outlined", "filled"],
 *   "importStatement": "import { SerendieSymbol } from \"@serendie/symbols\";",
 *   "usage": {
 *     "basic": "<SerendieSymbol name=\"activity\" />",
 *     "outlined": "<SerendieSymbol name=\"activity\" variant=\"outlined\" />",
 *     "filled": "<SerendieSymbol name=\"activity\" variant=\"filled\" />"
 *   }
 * }
 * ```
 *
 * シンボルが存在しない場合：
 * ```json
 * {
 *   "name": "invalid-symbol",
 *   "exists": false,
 *   "message": "Symbol 'invalid-symbol' not found in @serendie/symbols"
 * }
 * ```
 */
export function getSymbolDetailTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "get-symbol-detail",
    {
      title: "Get Serendie Symbol Detail",
      description:
        "Get detailed information about a specific Serendie symbol including usage examples",
      inputSchema: {
        /**
         * 詳細を取得したいシンボル名（必須）
         * @example "activity", "alert-circle", "zoom-in"
         */
        name: z.string().describe("The name of the symbol to get details for"),
      },
      outputSchema: GetSymbolDetailResponseSchema.shape,
    },
    async ({ name }) => {
      try {
        // シンボルが存在するか確認
        const exists = (symbolNames as readonly string[]).includes(name);

        if (!exists) {
          const notFoundResponse: GetSymbolDetailResponse = {
            name,
            exists: false,
            message: `Symbol '${name}' not found in @serendie/symbols`,
          };

          // スキーマで検証
          const validatedResponse =
            GetSymbolDetailResponseSchema.parse(notFoundResponse);

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

        // シンボルの詳細情報を生成
        const symbolDetail: GetSymbolDetailResponse = {
          /**
           * シンボル名
           */
          name,
          /**
           * シンボルが存在するかどうか
           */
          exists: true as const,
          /**
           * 利用可能なバリアント
           */
          variants: ["outlined", "filled"],
          /**
           * インポート文
           */
          importStatement:
            'import { SerendieSymbol } from "@serendie/symbols";',
          /**
           * 使用例（基本、アウトライン、塗りつぶし）
           */
          usage: {
            basic: `<SerendieSymbol name="${name}" />`,
            outlined: `<SerendieSymbol name="${name}" variant="outlined" />`,
            filled: `<SerendieSymbol name="${name}" variant="filled" />`,
          },
        };

        // スキーマで検証
        const validatedResponse =
          GetSymbolDetailResponseSchema.parse(symbolDetail);

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
                error: "Failed to fetch symbol detail",
                message:
                  error instanceof Error ? error.message : "Unknown error",
              }),
            },
          ],
          structuredContent: {
            error: "Failed to fetch symbol detail",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          isError: true,
        };
      }
    }
  );
}
