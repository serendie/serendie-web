import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  GetSymbolsResponseSchema,
  GetSymbolDetailResponseSchema,
  SymbolVariantSchema,
  type GetSymbolsResponse,
  type GetSymbolDetailResponse,
} from "../../schemas/symbols";

// Mock @serendie/symbols
vi.mock("@serendie/symbols", () => ({
  symbolNames: [
    "home",
    "search",
    "settings",
    "user",
    "close",
    "menu",
    "arrow_back",
    "arrow_forward",
    "check",
    "error",
    "warning",
    "info",
    "star",
    "favorite",
    "delete",
    "edit",
    "add",
    "remove",
    "refresh",
    "more_vert",
  ],
}));

// Import after mocking
import { getSymbolsTool, getSymbolDetailTool } from "../../tools/symbols";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("Symbols Tools", () => {
  describe("get-symbols", () => {
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

      getSymbolsTool(mcpServer);
    });

    it("should return all symbols when no filters are provided", async () => {
      const handler = registeredTools.get("get-symbols");
      const response = await handler!({});

      expect(response).toBeDefined();
      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe("text");

      // Parse and validate the response with schema
      const data = JSON.parse(response.content[0].text);
      const validation = GetSymbolsResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.total).toBe(20); // Based on our mock data
        expect(validatedData.filtered).toBe(validatedData.total);
        expect(validatedData.symbols).toHaveLength(20);
        expect(validatedData.variants).toEqual(["outlined", "filled"]);
      }
    });

    it("should filter symbols by search query", async () => {
      const handler = registeredTools.get("get-symbols");
      const response = await handler!({ search: "arrow" });

      const data = JSON.parse(response.content[0].text);
      const validation = GetSymbolsResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.filtered).toBeLessThan(validatedData.total);
        expect(validatedData.symbols).toHaveLength(2);
        expect(validatedData.symbols).toContain("arrow_back");
        expect(validatedData.symbols).toContain("arrow_forward");
      }
    });

    it("should perform case-insensitive search", async () => {
      const handler = registeredTools.get("get-symbols");
      const response = await handler!({ search: "STAR" });

      const data = JSON.parse(response.content[0].text);
      const validation = GetSymbolsResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.symbols).toHaveLength(1);
        expect(validatedData.symbols).toContain("star");
      }
    });

    it("should respect limit parameter", async () => {
      const limit = 5;
      const handler = registeredTools.get("get-symbols");
      const response = await handler!({ limit });

      const data = JSON.parse(response.content[0].text);
      const validation = GetSymbolsResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.symbols).toHaveLength(limit);
        expect(validatedData.total).toBe(20); // Total symbols available
        expect(validatedData.filtered).toBe(limit); // filtered shows the actual returned count
      }
    });

    it("should combine search and limit filters", async () => {
      const handler = registeredTools.get("get-symbols");
      const response = await handler!({ search: "e", limit: 3 });

      const data = JSON.parse(response.content[0].text);
      const validation = GetSymbolsResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        expect(validatedData.symbols.length).toBeLessThanOrEqual(3);
        validatedData.symbols.forEach((symbol) => {
          expect(symbol.toLowerCase()).toContain("e");
        });
      }
    });
  });

  describe("get-symbol-detail", () => {
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

      getSymbolDetailTool(mcpServer);
    });

    it("should return detailed information for existing symbol", async () => {
      const handler = registeredTools.get("get-symbol-detail");
      const response = await handler!({ name: "home" });

      const data = JSON.parse(response.content[0].text);
      const validation = GetSymbolDetailResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        if (validatedData.exists) {
          expect(validatedData.name).toBe("home");
          expect(validatedData.exists).toBe(true);
          expect(validatedData.variants).toEqual(["outlined", "filled"]);
          expect(validatedData.importStatement).toBe(
            'import { SerendieSymbol } from "@serendie/symbols";'
          );
          expect(validatedData.usage.basic).toBe(
            '<SerendieSymbol name="home" />'
          );
          expect(validatedData.usage.outlined).toBe(
            '<SerendieSymbol name="home" variant="outlined" />'
          );
          expect(validatedData.usage.filled).toBe(
            '<SerendieSymbol name="home" variant="filled" />'
          );
        }
      }
    });

    it("should return error for non-existent symbol", async () => {
      const handler = registeredTools.get("get-symbol-detail");
      const response = await handler!({ name: "nonexistent" });

      const data = JSON.parse(response.content[0].text);
      const validation = GetSymbolDetailResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;
        if (!validatedData.exists) {
          expect(validatedData.name).toBe("nonexistent");
          expect(validatedData.exists).toBe(false);
          expect(validatedData.message).toContain("not found");
        }
      }
    });
  });

  describe("Schema Validation", () => {
    it("should validate SymbolVariantSchema correctly", () => {
      // Valid variants
      expect(() => SymbolVariantSchema.parse("outlined")).not.toThrow();
      expect(() => SymbolVariantSchema.parse("filled")).not.toThrow();

      // Invalid variants
      expect(() => SymbolVariantSchema.parse("invalid")).toThrow();
      expect(() => SymbolVariantSchema.parse(123)).toThrow();
    });

    it("should validate GetSymbolsResponseSchema structure", () => {
      const validResponse: GetSymbolsResponse = {
        total: 100,
        filtered: 50,
        variants: ["outlined", "filled"],
        symbols: ["home", "search", "settings"],
      };

      const validation = GetSymbolsResponseSchema.safeParse(validResponse);
      expect(validation.success).toBe(true);

      // Invalid response
      const invalidResponse = {
        total: "not a number",
        filtered: 50,
      };
      const invalidValidation =
        GetSymbolsResponseSchema.safeParse(invalidResponse);
      expect(invalidValidation.success).toBe(false);
    });

    it("should validate GetSymbolDetailResponseSchema for both success and error cases", () => {
      // Success case
      const successResponse: GetSymbolDetailResponse = {
        name: "home",
        exists: true,
        variants: ["outlined", "filled"],
        importStatement: 'import { SerendieSymbol } from "@serendie/symbols";',
        usage: {
          basic: '<SerendieSymbol name="home" />',
          outlined: '<SerendieSymbol name="home" variant="outlined" />',
          filled: '<SerendieSymbol name="home" variant="filled" />',
        },
      };

      const successValidation =
        GetSymbolDetailResponseSchema.safeParse(successResponse);
      expect(successValidation.success).toBe(true);

      // Error case
      const errorResponse: GetSymbolDetailResponse = {
        name: "invalid-symbol",
        exists: false,
        message: "Symbol 'invalid-symbol' not found",
      };

      const errorValidation =
        GetSymbolDetailResponseSchema.safeParse(errorResponse);
      expect(errorValidation.success).toBe(true);

      // Invalid response
      const invalidResponse = {
        name: "test",
        exists: "not a boolean",
      };
      const invalidValidation =
        GetSymbolDetailResponseSchema.safeParse(invalidResponse);
      expect(invalidValidation.success).toBe(false);
    });

    it("should validate symbol usage structure", () => {
      const usage = {
        basic: '<SerendieSymbol name="test" />',
        outlined: '<SerendieSymbol name="test" variant="outlined" />',
        filled: '<SerendieSymbol name="test" variant="filled" />',
      };

      // Test by creating a full response and validating it
      const responseWithUsage = {
        name: "test",
        exists: true,
        variants: ["outlined", "filled"],
        importStatement: 'import { SerendieSymbol } from "@serendie/symbols";',
        usage,
      };

      const validation =
        GetSymbolDetailResponseSchema.safeParse(responseWithUsage);
      expect(validation.success).toBe(true);

      // Invalid usage
      const invalidUsage = {
        basic: 123,
        outlined: "valid",
        filled: "valid",
      };

      const invalidResponse = {
        name: "test",
        exists: true,
        variants: ["outlined", "filled"],
        importStatement: 'import { SerendieSymbol } from "@serendie/symbols";',
        usage: invalidUsage,
      };

      const invalidValidation =
        GetSymbolDetailResponseSchema.safeParse(invalidResponse);
      expect(invalidValidation.success).toBe(false);
    });
  });
});
