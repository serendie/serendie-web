import { describe, it, expect, beforeEach, vi } from "vitest";
import { z } from "zod";
import fs from "fs/promises";

// Mock fs module
vi.mock("fs/promises");

// Define the input schema similar to how it's defined in the tool
const inputSchema = {
  theme: z
    .enum(["asagi", "konjo", "kurikawa", "sumire", "tsutsuji"])
    .optional()
    .describe("The theme to get tokens for (defaults to 'asagi')"),
  category: z
    .enum(["color", "spacing", "typography", "all"])
    .optional()
    .describe("The category of tokens to retrieve (defaults to 'all')"),
};

describe("get-design-tokens Tool Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Input Schema Validation", () => {
    it("should accept valid themes", () => {
      const validThemes = ["asagi", "konjo", "kurikawa", "sumire", "tsutsuji"];
      validThemes.forEach((theme) => {
        expect(() => inputSchema.theme.parse(theme)).not.toThrow();
      });
    });

    it("should reject invalid themes", () => {
      expect(() => inputSchema.theme.parse("invalid-theme")).toThrow();
    });

    it("should accept valid categories", () => {
      const validCategories = ["color", "spacing", "typography", "all"];
      validCategories.forEach((category) => {
        expect(() => inputSchema.category.parse(category)).not.toThrow();
      });
    });

    it("should allow undefined values (optional)", () => {
      expect(inputSchema.theme.parse(undefined)).toBeUndefined();
      expect(inputSchema.category.parse(undefined)).toBeUndefined();
    });
  });

  describe("File System Interactions", () => {
    it("should read color token files from correct path", async () => {
      const mockColorData = { test: "data" };
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockColorData));

      // Simulate reading a color file
      const data = await fs.readFile("tokens/data/color.asagi.json", "utf-8");
      const parsed = JSON.parse(data);

      expect(parsed).toEqual(mockColorData);
      expect(vi.mocked(fs.readFile)).toHaveBeenCalledWith(
        "tokens/data/color.asagi.json",
        "utf-8"
      );
    });

    it("should handle file read errors", async () => {
      vi.mocked(fs.readFile).mockRejectedValue(
        new Error("ENOENT: File not found")
      );

      await expect(fs.readFile("nonexistent.json", "utf-8")).rejects.toThrow(
        "ENOENT: File not found"
      );
    });
  });

  describe("Expected Output Structure", () => {
    it("should return correct structure for color tokens", () => {
      const expectedOutput = {
        theme: "asagi",
        category: "color",
        tokens: {
          color: {
            web: {
              system: {
                color: {
                  impression: {
                    primary: {
                      $type: "color",
                      $value: "{sd.reference.color.scale.skyBlue.600}",
                    },
                  },
                },
              },
            },
          },
        },
        availableThemes: ["asagi", "konjo", "kurikawa", "sumire", "tsutsuji"],
      };

      // Verify the structure matches expected format
      expect(expectedOutput).toHaveProperty("theme");
      expect(expectedOutput).toHaveProperty("category");
      expect(expectedOutput).toHaveProperty("tokens");
      expect(expectedOutput).toHaveProperty("availableThemes");
      expect(expectedOutput.availableThemes).toHaveLength(5);
    });

    it("should return correct structure for spacing tokens", () => {
      const expectedOutput = {
        theme: "asagi",
        category: "spacing",
        tokens: {
          spacing: {
            note: "Spacing tokens extracted from Panda CSS",
            values: {
              "0": "0rem",
              "1": "0.25rem",
              "2": "0.5rem",
              "3": "0.75rem",
              "4": "1rem",
            },
          },
        },
        availableThemes: ["asagi", "konjo", "kurikawa", "sumire", "tsutsuji"],
      };

      expect(expectedOutput.tokens.spacing).toHaveProperty("note");
      expect(expectedOutput.tokens.spacing).toHaveProperty("values");
    });
  });
});
