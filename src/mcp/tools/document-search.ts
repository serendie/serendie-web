import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

interface CloudflareSearchContent {
  id?: string;
  type?: string;
  text?: string;
}

interface CloudflareSearchResult {
  file_id?: string;
  filename?: string;
  score?: number;
  attributes?: Record<string, unknown>;
  content?: CloudflareSearchContent[];
}

interface CloudflareSearchResponse {
  success: boolean;
  result?: {
    object?: string;
    search_query?: string;
    data?: CloudflareSearchResult[];
  };
  errors?: unknown;
  messages?: unknown;
}

const CLOUDFLARE_API_BASE =
  "https://api.cloudflare.com/client/v4/accounts" as const;

/**
 * Cloudflare AI Search を利用してドキュメント検索を行い、ヒットした本文を連結して返却する MCP ツール。
 *
 * @param mcpServer - MCP サーバーインスタンス
 */
export function getDocumentSearchTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "document-search",
    {
      title: "Document Search",
      description:
        "Run a query against Cloudflare AI Search and return the merged document content.",
      inputSchema: {
        /**
         * 検索したいクエリ文字列
         */
        query: z
          .string()
          .min(1, "Query must not be empty.")
          .describe("Plain text query used to search the document index."),
      },
    },
    async ({ query }) => {
      const accountId = process.env.CF_ACCOUNT_ID;
      const apiToken = process.env.CF_API_TOKEN;
      const indexName = process.env.DOCUMENT_SEARCH_INDEX;

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
          };
        }

        const results = Array.isArray(json.result?.data)
          ? json.result?.data
          : [];

        const mergedText = results
          .flatMap((result) =>
            Array.isArray(result.content) ? result.content : []
          )
          .filter(
            (
              item
            ): item is CloudflareSearchContent &
              Required<Pick<CloudflareSearchContent, "text">> =>
              item?.type === "text" && typeof item.text === "string"
          )
          .map((item) => item.text.trim())
          .filter((text) => text.length > 0)
          .join("\n\n");

        console.log(
          `Cloudflare AI Search request completed in ${Date.now() - startTime}ms`
        );
        return {
          content: [
            {
              type: "text",
              text: mergedText,
            },
          ],
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
        };
      }
    }
  );
}
