import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSearchDesignDocsTools } from "../../tools/search-design-docs";

type RegisteredHandler = (params: {
  query: string;
  nResults?: number;
}) => Promise<{
  content: Array<{ type: string; text: string }>;
  structuredContent?: unknown;
  isError?: boolean;
}>;

const registerTools = () => {
  const handlers = new Map<string, RegisteredHandler>();
  const configs = new Map<string, { title: string; description: string }>();

  const mockMcpServer = {
    registerTool: (
      name: string,
      config: { title: string; description: string },
      handler: RegisteredHandler
    ) => {
      configs.set(name, config);
      handlers.set(name, handler);
    },
  };

  getSearchDesignDocsTools(
    mockMcpServer as Parameters<typeof getSearchDesignDocsTools>[0]
  );

  return { configs, handlers };
};

describe("search design docs MCP tools", () => {
  const originalEndpoint = process.env.DOCS_SEARCH_API_ENDPOINT;
  const originalApiKey = process.env.DOCS_SEARCH_API_KEY;

  beforeEach(() => {
    process.env.DOCS_SEARCH_API_ENDPOINT = "https://example.com/api/search";
    process.env.DOCS_SEARCH_API_KEY = "test-api-key";
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    if (originalEndpoint === undefined) {
      delete process.env.DOCS_SEARCH_API_ENDPOINT;
    } else {
      process.env.DOCS_SEARCH_API_ENDPOINT = originalEndpoint;
    }
    if (originalApiKey === undefined) {
      delete process.env.DOCS_SEARCH_API_KEY;
    } else {
      process.env.DOCS_SEARCH_API_KEY = originalApiKey;
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("registers component and design token search tools", () => {
    const { configs } = registerTools();

    expect(configs.get("search-component-docs")?.title).toBe(
      "Search Component Docs"
    );
    expect(configs.get("search-component-docs")?.description).toBe(
      `コンポーネントの命名や設計のヒントになる参考資料を検索します。
新規コンポーネントの命名や設計、既存コンポーネントのパターンを理解する際に活用してください。`
    );
    expect(configs.get("search-design-token-docs")?.title).toBe(
      "Search Design Token Docs"
    );
    expect(configs.get("search-design-token-docs")?.description).toBe(
      `デザイントークンの使用法とデザイン原則を検索します。
デザイントークンの使用方法を検討・精査するときに使用してください。`
    );
  });

  it("searches ark_ui and component_gallery for component docs", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: "accordion",
            score: 0.9,
            source: "ark_ui",
            title: "Accordion",
            url: "https://ark-ui.com/react/docs/components/accordion",
            text: "Accordion guidance",
            metadata: { image: "data:image/png;base64,abc" },
          },
        ],
        total: 1,
      }),
    } as Response);

    const { handlers } = registerTools();
    const result = await handlers.get("search-component-docs")!({
      query: "accordion",
      nResults: 3,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://example.com/api/search",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "test-api-key",
        },
        body: JSON.stringify({
          query: "accordion",
          n_results: 3,
          source_filter: "ark_ui",
        }),
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://example.com/api/search",
      expect.objectContaining({
        body: JSON.stringify({
          query: "accordion",
          n_results: 3,
          source_filter: "component_gallery",
        }),
      })
    );
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("[image data removed]");
    expect(result.content[0].text).not.toContain("data:image/png;base64");
  });

  it("searches m3 for design token docs", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [], total: 0 }),
    } as Response);

    const { handlers } = registerTools();
    await handlers.get("search-design-token-docs")!({ query: "color role" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/api/search",
      expect.objectContaining({
        body: JSON.stringify({
          query: "color role",
          n_results: 5,
          source_filter: "m3",
        }),
      })
    );
  });

  it("returns MCP tool errors when doc-search API fails", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: async () => "search failed",
    } as Response);

    const { handlers } = registerTools();
    const result = await handlers.get("search-design-token-docs")!({
      query: "typography",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Doc search request failed");
    expect(result.content[0].text).toContain("search failed");
  });
});
