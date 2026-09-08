import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v3";
import { getBinding, getEnvValue } from "../utils/bindings";

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

interface SearchResult {
  url: string | null;
  title: string | null;
  score: number;
  content: string;
}

async function searchViaBinding(query: string): Promise<{
  searchQuery: string;
  results: SearchResult[];
} | null> {
  const binding = getBinding("GUIDELINE_SEARCH");
  if (!binding) return null;

  const response = await binding.search({
    messages: [{ role: "user", content: query }],
  });

  const results: SearchResult[] = response.chunks.map((chunk) => ({
    url: chunk.item.key ?? null,
    title:
      (chunk.item.metadata?.title as string) ??
      (chunk.item.metadata?.file as { title?: string })?.title ??
      null,
    score: chunk.score,
    content: chunk.text,
  }));

  return { searchQuery: response.search_query, results };
}

async function searchViaRestApi(query: string): Promise<{
  searchQuery: string;
  results: SearchResult[];
}> {
  const accountId = getEnvValue("CF_ACCOUNT_ID");
  const apiToken = getEnvValue("CF_API_TOKEN");
  const indexName = getEnvValue("DOCUMENT_SEARCH_INDEX");

  if (!accountId || !apiToken || !indexName) {
    throw new Error(
      "CF_ACCOUNT_ID, CF_API_TOKEN, and DOCUMENT_SEARCH_INDEX must be set."
    );
  }

  const endpoint = `${CLOUDFLARE_API_BASE}/${accountId}/autorag/rags/${indexName}/search`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      JSON.stringify({
        error: "Cloudflare AI Search request failed",
        status: response.status,
        statusText: response.statusText,
        details: errorText,
      })
    );
  }

  const json = (await response.json()) as CloudflareSearchResponse;

  if (!json.success) {
    throw new Error(
      JSON.stringify({
        error: "Cloudflare AI Search returned an unsuccessful response",
        details: json,
      })
    );
  }

  const rawResults = Array.isArray(json.result?.data) ? json.result?.data : [];

  const results: SearchResult[] = rawResults.map((result) => {
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

  return { searchQuery: json.result?.search_query ?? query, results };
}

export function getSearchSerendieGuidelineTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    "search-serendie-guideline",
    {
      title: "Search Serendie Guideline",
      description:
        "Search Serendie design guidelines using Cloudflare AI Search and return the merged document content.",
      inputSchema: {
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
      try {
        const { searchQuery, results } =
          (await searchViaBinding(query)) ??
          (await searchViaRestApi(query));

        const mergedContent = results
          .map((r) => r.content)
          .filter((text) => text.length > 0)
          .join("\n\n");

        const responseData = {
          searchQuery,
          totalResults: results.length,
          results,
          mergedContent,
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
