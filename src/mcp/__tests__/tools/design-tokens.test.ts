import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @serendie/design-token
vi.mock("@serendie/design-token/token-list", () => ({
  default: [
    {
      path: ["sd", "reference", "color", "scale", "gray", "100"],
      key: "sd.reference.color.scale.gray.100",
      type: "color",
      value: "#F5F5F5",
      originalValue: "#F5F5F5",
    },
    {
      path: ["sd", "reference", "color", "scale", "blue", "500"],
      key: "sd.reference.color.scale.blue.500",
      type: "color",
      value: "#0A69CF",
      originalValue: "#0A69CF",
    },
    {
      path: ["sd", "system", "color", "impression", "primaryContainer"],
      key: "sd.system.color.impression.primaryContainer",
      type: "color",
      value: "#0A69CF",
      originalValue: "{sd.reference.color.scale.blue.500}",
    },
    {
      path: ["sd", "system", "color", "impression", "secondaryContainer"],
      key: "sd.system.color.impression.secondaryContainer",
      type: "color",
      value: "#F5F5F5",
      originalValue: "{sd.reference.color.scale.gray.100}",
    },
    {
      path: ["sd", "reference", "typography", "scale", "expanded", "small"],
      key: "sd.reference.typography.scale.expanded.small",
      type: "typography",
      value: { fontSize: "14px", lineHeight: "20px" },
      originalValue: { fontSize: "14px", lineHeight: "20px" },
    },
    {
      path: ["sd", "reference", "dimension", "scale", "8"],
      key: "sd.reference.dimension.scale.8",
      type: "dimension",
      value: "8px",
      originalValue: "8px",
    },
  ],
}));

// Import after mocking
import {
  getDesignTokensTool,
  getDesignTokenDetailTool,
} from "../../tools/design-tokens";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("Design Tokens Tools", () => {
  describe("get-design-tokens", () => {
    let mcpServer: McpServer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let registeredTools: Map<string, (args: any) => Promise<any>>;

    beforeEach(() => {
      registeredTools = new Map();
      mcpServer = {
        registerTool: vi.fn((name, _schema, handler) => {
          registeredTools.set(name, handler);
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      getDesignTokensTool(mcpServer);
    });

    it("should return all design tokens when no filters are provided", async () => {
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({});

      expect(response).toBeDefined();
      expect(response.content).toHaveLength(1);

      const data = JSON.parse(response.content[0].text);
      expect(data).toMatchObject({
        total: expect.any(Number),
        filtered: expect.any(Number),
        returned: expect.any(Number),
        types: expect.any(Array),
        tokens: expect.any(Array),
      });

      expect(data.total).toBe(6); // Based on our mock data
      expect(data.filtered).toBe(data.total);
      expect(data.tokens.length).toBe(6);
    });

    it("should filter tokens by search query", async () => {
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({ search: "primary" });
      const data = JSON.parse(response.content[0].text);

      expect(data.filtered).toBeLessThan(data.total);
      expect(data.tokens).toHaveLength(1);
      data.tokens.forEach((token: { key: string }) => {
        expect(token.key.toLowerCase()).toContain("primary");
      });
    });

    it("should filter tokens by type", async () => {
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({ type: "color" });
      const data = JSON.parse(response.content[0].text);

      expect(data.filtered).toBe(4); // We have 4 color tokens in mock
      data.tokens.forEach((token: { type: string }) => {
        expect(token.type).toBe("color");
      });
    });

    it("should filter tokens by category", async () => {
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({ category: "reference" });
      const data = JSON.parse(response.content[0].text);

      expect(data.filtered).toBe(4); // We have 4 reference tokens in mock
      data.tokens.forEach((token: { key: string; category: string }) => {
        expect(token.key).toContain("sd.reference");
        expect(token.category).toBe("reference");
      });
    });

    it("should respect limit parameter", async () => {
      const limit = 3;
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({ limit });
      const data = JSON.parse(response.content[0].text);

      expect(data.returned).toBe(limit);
      expect(data.tokens.length).toBe(limit);
      expect(data.filtered).toBe(6); // Total filtered before limit
    });

    it("should combine multiple filters", async () => {
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({
        type: "color",
        category: "system",
        search: "impression",
        limit: 5,
      });
      const data = JSON.parse(response.content[0].text);

      expect(data.tokens.length).toBe(2); // Two system color tokens with "impression"
      data.tokens.forEach(
        (token: { type: string; category: string; key: string }) => {
          expect(token.type).toBe("color");
          expect(token.category).toBe("system");
          expect(token.key.toLowerCase()).toContain("impression");
        }
      );
    });
  });

  describe("get-design-token-detail", () => {
    let mcpServer: McpServer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let registeredTools: Map<string, (args: any) => Promise<any>>;

    beforeEach(() => {
      registeredTools = new Map();
      mcpServer = {
        registerTool: vi.fn((name, _schema, handler) => {
          registeredTools.set(name, handler);
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      getDesignTokenDetailTool(mcpServer);
    });

    it("should return detailed information for existing token", async () => {
      const handler = registeredTools.get("get-design-token-detail");
      const response = await handler!({
        key: "sd.reference.color.scale.gray.100",
      });
      const data = JSON.parse(response.content[0].text);

      expect(data).toMatchObject({
        key: "sd.reference.color.scale.gray.100",
        exists: true,
        path: ["sd", "reference", "color", "scale", "gray", "100"],
        type: "color",
        value: "#F5F5F5",
        originalValue: "#F5F5F5",
        category: "reference",
        theme: null,
        cssVariable: "var(--sd-reference-color-scale-gray-100)",
        usage: expect.objectContaining({
          css: expect.any(String),
          pandacss: expect.any(String),
        }),
      });
    });

    it("should return error for non-existent token", async () => {
      const handler = registeredTools.get("get-design-token-detail");
      const response = await handler!({ key: "invalid.token.key" });
      const data = JSON.parse(response.content[0].text);

      expect(data).toMatchObject({
        key: "invalid.token.key",
        exists: false,
        message: expect.stringContaining("not found"),
      });
    });

    it("should include reference information for system tokens", async () => {
      const handler = registeredTools.get("get-design-token-detail");
      const response = await handler!({
        key: "sd.system.color.impression.primaryContainer",
      });
      const data = JSON.parse(response.content[0].text);

      expect(data.category).toBe("system");
      expect(data.originalValue).toBe("{sd.reference.color.scale.blue.500}");
      expect(data.references).toBe("sd.reference.color.scale.blue.500");
    });
  });
});
