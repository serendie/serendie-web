import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  GetDesignTokensResponseSchema,
  GetDesignTokenDetailResponseSchema,
  TokenTypeSchema,
  TokenCategorySchema,
  ThemeSchema,
  type GetDesignTokensResponse,
  type GetDesignTokenDetailResponse,
} from "../../schemas/design-tokens";
import {
  getDesignTokensTool,
  getDesignTokenDetailTool,
} from "../../tools/design-tokens";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// 実際のデータを使用
import tokens from "@serendie/design-token/token-list";

describe("Design Tokens Tools", () => {
  describe("get-design-tokens", () => {
    let mcpServer: McpServer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let registeredTools: Map<string, (args: any) => Promise<any>>;

    beforeEach(() => {
      registeredTools = new Map();
      mcpServer = {
        registerTool: vi.fn(
          (
            name: string,
            _schema: unknown,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler: (args: any) => Promise<any>
          ) => {
            registeredTools.set(name, handler);
          }
        ),
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
        expect(validatedData.total).toBe(tokens.length); // 実際のトークン数
        expect(validatedData.filtered).toBe(validatedData.total);
        expect(validatedData.returned).toBe(tokens.length);
        expect(validatedData.tokens).toHaveLength(tokens.length);

        // 実際のトークンタイプを確認
        const expectedTypes = [
          "color",
          "dimension",
          "fontFamily",
          "fontWeight",
          "number",
          "shadow",
          "typography",
        ];
        expectedTypes.forEach((type) => {
          expect(validatedData.types).toContain(type);
        });
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
        const expectedCount = tokens.filter((t) => t.type === "color").length;
        expect(validatedData.filtered).toBe(expectedCount);
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
        const expectedCount = tokens.filter((t) =>
          t.key.includes("sd.reference")
        ).length;
        expect(validatedData.filtered).toBe(expectedCount);
        validatedData.tokens.forEach((token) => {
          expect(token.key).toContain("sd.reference");
          expect(token.category).toBe("reference");
        });
      }
    });

    it("should respect limit parameter", async () => {
      const limit = 10;
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({ limit });

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokensResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.returned).toBe(limit);
        expect(validatedData.tokens).toHaveLength(limit);
        expect(validatedData.filtered).toBe(tokens.length); // Total filtered before limit
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
        const expectedTokens = tokens.filter(
          (t) =>
            t.type === "color" &&
            t.key.includes("sd.system") &&
            !t.key.includes("themes")
        );
        expect(validatedData.returned).toBeLessThanOrEqual(5);
        expect(validatedData.filtered).toBe(expectedTokens.length);
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
        registerTool: vi.fn(
          (
            name: string,
            _schema: unknown,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler: (args: any) => Promise<any>
          ) => {
            registeredTools.set(name, handler);
          }
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      getDesignTokenDetailTool(mcpServer);
    });

    it("should return detailed information for existing token", async () => {
      const handler = registeredTools.get("get-design-token-detail");
      // 実際のトークンから1つ選択
      const sampleToken = tokens.find(
        (t) => t.type === "color" && t.key.includes("reference")
      );
      expect(sampleToken).toBeDefined();

      const response = await handler!({
        key: sampleToken!.key,
      });

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokenDetailResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        if (validatedData.exists) {
          expect(validatedData.key).toBe(sampleToken!.key);
          expect(validatedData.exists).toBe(true);
          expect(validatedData.path).toEqual(sampleToken!.path);
          expect(validatedData.type).toBe(sampleToken!.type);
          expect(validatedData.value).toEqual(sampleToken!.value);
          expect(validatedData.originalValue).toEqual(
            sampleToken!.originalValue
          );
          expect(validatedData.category).toBe("reference");
          expect(validatedData.theme).toBeNull();
          expect(validatedData.cssVariable).toBe(
            `var(--${sampleToken!.key.replace(/\./g, "-")})`
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
      // リファレンスを持つシステムトークンを探す
      const systemTokenWithRef = tokens.find(
        (t) =>
          t.key.includes("sd.system") &&
          typeof t.originalValue === "string" &&
          t.originalValue.startsWith("{") &&
          t.originalValue.endsWith("}")
      );

      if (systemTokenWithRef) {
        const response = await handler!({
          key: systemTokenWithRef.key,
        });

        const data = JSON.parse(response.content[0].text);
        const validation = GetDesignTokenDetailResponseSchema.safeParse(data);
        expect(validation.success).toBe(true);

        if (validation.success) {
          const validatedData = validation.data;
          if (validatedData.exists) {
            expect(validatedData.category).toBe("system");
            expect(validatedData.originalValue).toBe(
              systemTokenWithRef.originalValue
            );
            expect(validatedData.references).toBe(
              (systemTokenWithRef.originalValue as string).slice(1, -1)
            );
          }
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
