import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v3";

const DEFAULT_DOCS_SEARCH_API_ENDPOINT =
  "https://design-docs-search.takram-spread.workers.dev/api/search";

type SourceFilter = "ark_ui" | "component_gallery" | "m3";
type WorkerEnv = Record<string, string | undefined>;

interface SearchDocsResponse {
  results?: unknown[];
  total?: number;
}

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

const removeBase64Data = (value: unknown): unknown => {
  if (typeof value === "string") {
    if (value.startsWith("data:image/")) {
      return "[image data removed]";
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(removeBase64Data);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        removeBase64Data(nestedValue),
      ])
    );
  }

  return value;
};

const searchDocs = async ({
  query,
  nResults,
  sourceFilters,
}: {
  query: string;
  nResults: number;
  sourceFilters: SourceFilter[];
}) => {
  const endpoint =
    getEnvValue("DOCS_SEARCH_API_ENDPOINT") ?? DEFAULT_DOCS_SEARCH_API_ENDPOINT;
  const apiKey = getEnvValue("DOCS_SEARCH_API_KEY");

  const responses = await Promise.all(
    sourceFilters.map(async (sourceFilter) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) {
        headers["X-API-Key"] = apiKey;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          n_results: nResults,
          source_filter: sourceFilter,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          JSON.stringify({
            error: "Doc search request failed",
            status: response.status,
            statusText: response.statusText,
            details: errorText,
          })
        );
      }

      return (await response.json()) as SearchDocsResponse;
    })
  );

  const results = responses.flatMap((response) => response.results ?? []);

  return {
    query,
    totalResults: results.length,
    results: removeBase64Data(results),
  };
};

const searchDocsParams = {
  query: z.string().min(1).describe("Plain text query used to search docs."),
  nResults: z
    .number()
    .min(1)
    .max(20)
    .optional()
    .default(5)
    .describe("Number of results to return. Defaults to 5."),
};

const createSearchDocsHandler =
  (sourceFilters: SourceFilter[]) =>
  async ({ query, nResults }: { query: string; nResults?: number }) => {
    try {
      const responseData = await searchDocs({
        query,
        nResults: nResults ?? 5,
        sourceFilters,
      });

      return {
        content: [
          {
            type: "text" as const,
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
            type: "text" as const,
            text:
              error instanceof Error
                ? error.message
                : JSON.stringify({
                    error: "Failed to execute doc search request",
                  }),
          },
        ],
        isError: true,
      };
    }
  };

export function getSearchDesignDocsTools(mcpServer: McpServer) {
  mcpServer.registerTool(
    "search-component-docs",
    {
      title: "Search Component Docs",
      description:
        "Search ARK UI and Component Gallery docs for component naming and design patterns.",
      inputSchema: searchDocsParams,
      outputSchema: {
        query: z.string(),
        totalResults: z.number(),
        results: z.array(z.unknown()),
      },
    },
    createSearchDocsHandler(["ark_ui", "component_gallery"])
  );

  mcpServer.registerTool(
    "search-design-token-docs",
    {
      title: "Search Design Token Docs",
      description:
        "Search Material Design 3 docs for design token usage and design principles.",
      inputSchema: searchDocsParams,
      outputSchema: {
        query: z.string(),
        totalResults: z.number(),
        results: z.array(z.unknown()),
      },
    },
    createSearchDocsHandler(["m3"])
  );
}
