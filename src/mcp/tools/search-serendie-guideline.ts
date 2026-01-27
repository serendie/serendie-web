import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v3";

interface CloudflareSearchContent {
  id?: string;
  type?: string;
  text?: string;
}

interface CloudflareFileAttributes {
  description?: string;
  image?: string;
  title?: string;
}

interface CloudflareSearchAttributes {
  timestamp?: number;
  folder?: string;
  filename?: string;
  file?: CloudflareFileAttributes;
}

interface CloudflareSearchResult {
  file_id?: string;
  /** 検索結果のURL（例: https://serendie.design/components/text-field） */
  filename?: string;
  score?: number;
  attributes?: CloudflareSearchAttributes;
  content?: CloudflareSearchContent[];
}

interface CloudflareSearchResponse {
  success: boolean;
  result?: {
    object?: string;
    search_query?: string;
    data?: CloudflareSearchResult[];
    has_more?: boolean;
    next_page?: string | null;
  };
  errors?: unknown;
  messages?: unknown;
}

const CLOUDFLARE_API_BASE =
  "https://api.cloudflare.com/client/v4/accounts" as const;

type WorkerEnv = Record<string, string | undefined>;

const getEnvValue = (key: string): string | undefined => {
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }

  const globalEnv = (
    globalThis as typeof globalThis & {
      __SERENDIE_WORKER_ENV__?: WorkerEnv;
    }
  ).__SERENDIE_WORKER_ENV__;

  return globalEnv?.[key];
};

/**
 * Cloudflare AI Search を利用してドキュメント検索を行い、ヒットした本文を連結して返却する MCP ツール。
 *
 * @param mcpServer - MCP サーバーインスタンス
 */
export function getSearchSerendieGuidelineTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "search-serendie-guideline",
    {
      title: "Search Serendie Guideline",
      description:
        "Search Serendie design guidelines using Cloudflare AI Search and return the merged document content.",
      inputSchema: {
        /**
         * 検索したいクエリ文字列
         */
        query: z
          .string()
          .min(1, "Query must not be empty.")
          .describe("Plain text query used to search the document index."),
      },
      outputSchema: {
        searchQuery: z
          .string()
          .describe("The search query (may be optimized by Cloudflare)"),
        totalResults: z.number().describe("Total number of search results"),
        results: z
          .array(
            z.object({
              url: z.string().nullable().describe("URL of the source document"),
              title: z
                .string()
                .nullable()
                .describe("Title of the source document"),
              score: z.number().describe("Relevance score (0-1)"),
              content: z.string().describe("Text content of the search result"),
            })
          )
          .describe("Array of search results with URL and content"),
        mergedContent: z
          .string()
          .describe("All content merged into a single string"),
      },
    },
    async ({ query }) => {
      const accountId = getEnvValue("CF_ACCOUNT_ID");
      const apiToken = getEnvValue("CF_API_TOKEN");
      const indexName = getEnvValue("DOCUMENT_SEARCH_INDEX");

      if (!accountId || !apiToken || !indexName) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: "Missing Cloudflare credentials",
                  message:
                    "CF_ACCOUNT_ID, CF_API_TOKEN, and DOCUMENT_SEARCH_INDEX must be set.",
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }

      const endpoint = `${CLOUDFLARE_API_BASE}/${accountId}/autorag/rags/${indexName}/search`;

      try {
        const startTime = Date.now();
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    error: "Cloudflare AI Search request failed",
                    status: response.status,
                    statusText: response.statusText,
                    details: errorText,
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }

        const json = (await response.json()) as CloudflareSearchResponse;

        if (!json.success) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    error:
                      "Cloudflare AI Search returned an unsuccessful response",
                    details: json,
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }

        const rawResults = Array.isArray(json.result?.data)
          ? json.result?.data
          : [];

        // 各検索結果をURL情報付きで構造化
        const structuredResults = rawResults.map((result) => {
          const texts = (result.content ?? [])
            .filter(
              (item): item is CloudflareSearchContent & { text: string } =>
                item?.type === "text" && typeof item.text === "string"
            )
            .map((item) => item.text.trim())
            .filter((text) => text.length > 0);

          return {
            url: result.filename ?? null,
            title: result.attributes?.file?.title ?? null,
            score: result.score ?? 0,
            content: texts.join("\n\n"),
          };
        });

        // 全テキストを連結したものも用意（後方互換性のため）
        const mergedText = structuredResults
          .map((r) => r.content)
          .filter((text) => text.length > 0)
          .join("\n\n");

        console.log(
          `Cloudflare AI Search request completed in ${Date.now() - startTime}ms`
        );

        // 構造化されたレスポンスを返す
        const responseData = {
          searchQuery: json.result?.search_query ?? query,
          totalResults: structuredResults.length,
          results: structuredResults,
          mergedContent: mergedText,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(responseData, null, 2),
            },
          ],
          structuredContent: responseData,
          isError: false,
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: "Failed to execute Cloudflare AI Search request",
                  message:
                    error instanceof Error ? error.message : "Unknown error",
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
