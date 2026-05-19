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

const componentDocsParams = {
  query: z.string().min(1).describe("コンポーネントの検索クエリ"),
  nResults: z
    .number()
    .min(1)
    .max(20)
    .optional()
    .default(5)
    .describe("返される結果の数 (デフォルト: 5)"),
};

const designTokenDocsParams = {
  query: z.string().min(1).describe("デザイントークンの検索クエリ"),
  nResults: z
    .number()
    .min(1)
    .max(20)
    .optional()
    .default(5)
    .describe("返される結果の数 (デフォルト: 5)"),
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
    "search-design-patterns",
    {
      title: "Search Design Patterns",
      description: `Ark UIおよびデザインシステムギャラリーサイト (component.gallery) 掲載のコンポーネントを対象に、デザインパターンを検索できます。
コンポーネントの命名やプロパティやバリアントの種類など、UIコンポーネント設計の参考情報を得ることができます。
新規コンポーネントの命名や設計、既存コンポーネントのパターンを理解する際に活用してください。
@serendie/ui の実装・既存コンポーネント利用・SDS準拠判断では、必ず search-serendie-guideline / get-components を優先してください。`,
      inputSchema: componentDocsParams,
      outputSchema: {
        query: z.string(),
        totalResults: z.number(),
        results: z.array(z.unknown()),
      },
    },
    createSearchDocsHandler(["ark_ui", "component_gallery"])
  );

  mcpServer.registerTool(
    "search-md3-design-token-docs",
    {
      title: "Search MD3 Design Token Docs",
      description: `Material Design 3のデザイントークン設計に関するドキュメントを検索できます。
Serendie Design System (Serendie UI)のデザイントークンは、Material Design 3の設計を踏襲しているため、Serendie UIを使う上での参考情報となります。
デザイントークンの使用方法を検討・精査するときに使用してください。
@serendie/design-token の既存トークン利用・SDS準拠判断では、必ず search-serendie-guideline / get-design-tokens を優先してください。`,
      inputSchema: designTokenDocsParams,
      outputSchema: {
        query: z.string(),
        totalResults: z.number(),
        results: z.array(z.unknown()),
      },
    },
    createSearchDocsHandler(["m3"])
  );
}
