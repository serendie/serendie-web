import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  GetDesignTokensResponseSchema,
  GetDesignTokenDetailResponseSchema,
  TokenTypeSchema,
  TokenCategorySchema,
  ThemeSchema,
  type GetDesignTokensResponse,
  type GetDesignTokenDetailResponse,
} from "../../schemas/design-tokens";

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
      expect(response.content[0].type).toBe("text");

      // Parse and validate the response with schema
      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokensResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.total).toBe(6); // Based on our mock data
        expect(validatedData.filtered).toBe(validatedData.total);
        expect(validatedData.returned).toBe(6);
        expect(validatedData.tokens).toHaveLength(6);
        expect(validatedData.types).toContain("color");
        expect(validatedData.types).toContain("typography");
        expect(validatedData.types).toContain("dimension");
      }
    });

    it("should filter tokens by type", async () => {
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({ type: "color" });

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokensResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.filtered).toBe(4); // We have 4 color tokens in mock
        validatedData.tokens.forEach((token) => {
          expect(token.type).toBe("color");
        });
      }
    });

    it("should filter tokens by category", async () => {
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({ category: "reference" });

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokensResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.filtered).toBe(4); // We have 4 reference tokens in mock
        validatedData.tokens.forEach((token) => {
          expect(token.key).toContain("sd.reference");
          expect(token.category).toBe("reference");
        });
      }
    });

    it("should respect limit parameter", async () => {
      const limit = 3;
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({ limit });

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokensResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.returned).toBe(limit);
        expect(validatedData.tokens).toHaveLength(limit);
        expect(validatedData.filtered).toBe(6); // Total filtered before limit
      }
    });

    it("should combine multiple filters", async () => {
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({
        type: "color",
        category: "system",
        limit: 5,
      });

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokensResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.tokens).toHaveLength(2); // Two system color tokens
        validatedData.tokens.forEach((token) => {
          expect(token.type).toBe("color");
          expect(token.category).toBe("system");
        });
      }
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
      const validation = GetDesignTokenDetailResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        if (validatedData.exists) {
          expect(validatedData.key).toBe("sd.reference.color.scale.gray.100");
          expect(validatedData.exists).toBe(true);
          expect(validatedData.path).toEqual([
            "sd",
            "reference",
            "color",
            "scale",
            "gray",
            "100",
          ]);
          expect(validatedData.type).toBe("color");
          expect(validatedData.value).toBe("#F5F5F5");
          expect(validatedData.originalValue).toBe("#F5F5F5");
          expect(validatedData.category).toBe("reference");
          expect(validatedData.theme).toBeNull();
          expect(validatedData.cssVariable).toBe(
            "var(--sd-reference-color-scale-gray-100)"
          );
          expect(validatedData.usage.css).toContain("color:");
          expect(validatedData.usage.pandacss).toContain("color:");
        }
      }
    });

    it("should return error for non-existent token", async () => {
      const handler = registeredTools.get("get-design-token-detail");
      const response = await handler!({ key: "invalid.token.key" });

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokenDetailResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        if (!validatedData.exists) {
          expect(validatedData.key).toBe("invalid.token.key");
          expect(validatedData.exists).toBe(false);
          expect(validatedData.message).toContain("not found");
        }
      }
    });

    it("should include reference information for system tokens", async () => {
      const handler = registeredTools.get("get-design-token-detail");
      const response = await handler!({
        key: "sd.system.color.impression.primaryContainer",
      });

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokenDetailResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        if (validatedData.exists) {
          expect(validatedData.category).toBe("system");
          expect(validatedData.originalValue).toBe(
            "{sd.reference.color.scale.blue.500}"
          );
          expect(validatedData.references).toBe(
            "sd.reference.color.scale.blue.500"
          );
        }
      }
    });
  });

  describe("Schema Validation", () => {
    it("should validate TokenTypeSchema correctly", () => {
      // Valid types
      expect(() => TokenTypeSchema.parse("color")).not.toThrow();
      expect(() => TokenTypeSchema.parse("typography")).not.toThrow();
      expect(() => TokenTypeSchema.parse("dimension")).not.toThrow();

      // Invalid types
      expect(() => TokenTypeSchema.parse("invalid")).toThrow();
      expect(() => TokenTypeSchema.parse(123)).toThrow();
    });

    it("should validate TokenCategorySchema correctly", () => {
      // Valid categories
      expect(() => TokenCategorySchema.parse("reference")).not.toThrow();
      expect(() => TokenCategorySchema.parse("system")).not.toThrow();
      expect(() => TokenCategorySchema.parse("theme")).not.toThrow();

      // Invalid categories
      expect(() => TokenCategorySchema.parse("invalid")).toThrow();
    });

    it("should validate ThemeSchema correctly", () => {
      // Valid themes
      expect(() => ThemeSchema.parse("asagi")).not.toThrow();
      expect(() => ThemeSchema.parse("konjo")).not.toThrow();

      // Invalid themes
      expect(() => ThemeSchema.parse("invalid-theme")).toThrow();
    });

    it("should validate GetDesignTokensResponseSchema structure", () => {
      const validResponse: GetDesignTokensResponse = {
        total: 100,
        filtered: 50,
        returned: 10,
        types: ["color", "typography"],
        tokens: [
          {
            key: "test.token",
            path: ["test", "token"],
            type: "color",
            value: "#000000",
            originalValue: "#000000",
            category: "reference",
            theme: null,
          },
        ],
      };

      const validation = GetDesignTokensResponseSchema.safeParse(validResponse);
      expect(validation.success).toBe(true);

      // Invalid response
      const invalidResponse = {
        total: "not a number",
        filtered: 50,
      };
      const invalidValidation =
        GetDesignTokensResponseSchema.safeParse(invalidResponse);
      expect(invalidValidation.success).toBe(false);
    });

    it("should validate GetDesignTokenDetailResponseSchema for both success and error cases", () => {
      // Success case
      const successResponse: GetDesignTokenDetailResponse = {
        key: "test.token",
        exists: true,
        path: ["test", "token"],
        type: "color",
        value: "#000000",
        originalValue: "#000000",
        category: "reference",
        theme: null,
        cssVariable: "var(--test-token)",
        usage: {
          css: "color: var(--test-token);",
          pandacss: "color: 'test.token'",
        },
        references: null,
      };

      const successValidation =
        GetDesignTokenDetailResponseSchema.safeParse(successResponse);
      expect(successValidation.success).toBe(true);

      // Error case
      const errorResponse: GetDesignTokenDetailResponse = {
        key: "invalid.token",
        exists: false,
        message: "Token 'invalid.token' not found",
      };

      const errorValidation =
        GetDesignTokenDetailResponseSchema.safeParse(errorResponse);
      expect(errorValidation.success).toBe(true);

      // Invalid response
      const invalidResponse = {
        key: "test",
        exists: "not a boolean",
      };
      const invalidValidation =
        GetDesignTokenDetailResponseSchema.safeParse(invalidResponse);
      expect(invalidValidation.success).toBe(false);
    });
  });
});
