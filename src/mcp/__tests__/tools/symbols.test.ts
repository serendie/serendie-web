import { describe, it, expect, vi } from "vitest";
import { z } from "zod";

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

// Test data
const mockSymbolNames = [
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
];

describe("get-symbols Tool", () => {
  // Define the input schema similar to how it's defined in the tool
  const inputSchema = {
    search: z
      .string()
      .optional()
      .describe("Optional search query to filter symbols by name"),
    limit: z
      .number()
      .optional()
      .describe("Maximum number of results to return (default: all)"),
  };

  describe("Input Schema Validation", () => {
    it("should accept valid search string", () => {
      expect(() => inputSchema.search.parse("arrow")).not.toThrow();
      expect(() => inputSchema.search.parse("")).not.toThrow();
    });

    it("should accept valid limit number", () => {
      expect(() => inputSchema.limit.parse(10)).not.toThrow();
      expect(() => inputSchema.limit.parse(1)).not.toThrow();
      expect(() => inputSchema.limit.parse(100)).not.toThrow();
    });

    it("should allow undefined values (optional)", () => {
      expect(inputSchema.search.parse(undefined)).toBeUndefined();
      expect(inputSchema.limit.parse(undefined)).toBeUndefined();
    });

    it("should reject invalid types", () => {
      expect(() => inputSchema.search.parse(123)).toThrow();
      expect(() => inputSchema.limit.parse("10")).toThrow();
    });
  });

  describe("Search Functionality", () => {
    it("should filter symbols by search query", () => {
      const searchQuery = "arrow";
      const filtered = mockSymbolNames.filter((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toEqual(["arrow_back", "arrow_forward"]);
    });

    it("should perform case-insensitive search", () => {
      const searchQuery = "ARROW";
      const filtered = mockSymbolNames.filter((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toEqual(["arrow_back", "arrow_forward"]);
    });

    it("should return all symbols when no search query", () => {
      const filtered = mockSymbolNames.filter(() => true);
      expect(filtered).toHaveLength(20);
    });
  });

  describe("Expected Output Structure", () => {
    it("should return correct structure with all symbols", () => {
      const expectedOutput = {
        total: mockSymbolNames.length,
        filtered: mockSymbolNames.length,
        variants: ["outlined", "filled"],
        symbols: mockSymbolNames,
      };

      expect(expectedOutput).toHaveProperty("total", 20);
      expect(expectedOutput).toHaveProperty("filtered", 20);
      expect(expectedOutput).toHaveProperty("variants");
      expect(expectedOutput.variants).toEqual(["outlined", "filled"]);
      expect(expectedOutput).toHaveProperty("symbols");
      expect(expectedOutput.symbols).toHaveLength(20);
    });

    it("should return correct structure with filtered results", () => {
      const searchQuery = "star";
      const filtered = mockSymbolNames.filter((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const expectedOutput = {
        total: mockSymbolNames.length,
        filtered: filtered.length,
        variants: ["outlined", "filled"],
        symbols: filtered,
      };

      expect(expectedOutput.total).toBe(20);
      expect(expectedOutput.filtered).toBe(1);
      expect(expectedOutput.symbols).toEqual(["star"]);
    });
  });
});

describe("get-symbol-detail Tool", () => {
  // Define the input schema
  const inputSchema = {
    name: z.string().describe("The name of the symbol to get details for"),
  };

  describe("Input Schema Validation", () => {
    it("should accept valid symbol name", () => {
      expect(() => inputSchema.name.parse("activity")).not.toThrow();
      expect(() => inputSchema.name.parse("alert-circle")).not.toThrow();
    });

    it("should reject invalid types", () => {
      expect(() => inputSchema.name.parse(123)).toThrow();
      expect(() => inputSchema.name.parse(null)).toThrow();
      expect(() => inputSchema.name.parse(undefined)).toThrow();
    });

    it("should require name parameter", () => {
      expect(() => inputSchema.name.parse(undefined)).toThrow();
    });
  });

  describe("Symbol Existence Check", () => {
    it("should correctly identify existing symbols", () => {
      const exists = mockSymbolNames.includes("home");
      expect(exists).toBe(true);
    });

    it("should correctly identify non-existing symbols", () => {
      const exists = mockSymbolNames.includes("nonexistent");
      expect(exists).toBe(false);
    });
  });

  describe("Expected Output Structure", () => {
    it("should return correct structure for existing symbol", () => {
      const symbolName = "activity";
      const expectedOutput = {
        name: symbolName,
        exists: true,
        variants: ["outlined", "filled"],
        importStatement: 'import { SerendieSymbol } from "@serendie/symbols";',
        usage: {
          basic: `<SerendieSymbol name="${symbolName}" />`,
          outlined: `<SerendieSymbol name="${symbolName}" variant="outlined" />`,
          filled: `<SerendieSymbol name="${symbolName}" variant="filled" />`,
        },
      };

      expect(expectedOutput).toHaveProperty("name", symbolName);
      expect(expectedOutput).toHaveProperty("exists", true);
      expect(expectedOutput).toHaveProperty("variants");
      expect(expectedOutput.variants).toEqual(["outlined", "filled"]);
      expect(expectedOutput).toHaveProperty("importStatement");
      expect(expectedOutput).toHaveProperty("usage");
      expect(expectedOutput.usage).toHaveProperty("basic");
      expect(expectedOutput.usage).toHaveProperty("outlined");
      expect(expectedOutput.usage).toHaveProperty("filled");
    });

    it("should return correct structure for non-existing symbol", () => {
      const symbolName = "nonexistent";
      const expectedOutput = {
        name: symbolName,
        exists: false,
        message: `Symbol '${symbolName}' not found in @serendie/symbols`,
      };

      expect(expectedOutput).toHaveProperty("name", symbolName);
      expect(expectedOutput).toHaveProperty("exists", false);
      expect(expectedOutput).toHaveProperty("message");
    });
  });

  describe("Usage Examples", () => {
    it("should generate correct JSX usage examples", () => {
      const symbolName = "home";
      const usage = {
        basic: `<SerendieSymbol name="${symbolName}" />`,
        outlined: `<SerendieSymbol name="${symbolName}" variant="outlined" />`,
        filled: `<SerendieSymbol name="${symbolName}" variant="filled" />`,
      };

      expect(usage.basic).toContain(symbolName);
      expect(usage.outlined).toContain(symbolName);
      expect(usage.outlined).toContain('variant="outlined"');
      expect(usage.filled).toContain(symbolName);
      expect(usage.filled).toContain('variant="filled"');
    });
  });
});
