import { z } from "zod";

// Design token type enum
export const TokenTypeSchema = z.enum([
  "color",
  "typography",
  "dimension",
  "elevation",
  "radius",
  "spacing",
  "opacity",
]);

// Token category enum
export const TokenCategorySchema = z.enum(["reference", "system", "theme"]);

// Theme enum
export const ThemeSchema = z.enum([
  "asagi",
  "konjo",
  "kurikawa",
  "sumire",
  "tsutsuji",
]);

// Individual token schema
export const DesignTokenSchema = z.object({
  key: z.string(),
  path: z.array(z.string()),
  type: TokenTypeSchema,
  value: z.any(), // Can be string, number, or object (for typography tokens)
  originalValue: z.any(), // Can be string, number, or object
  category: TokenCategorySchema,
  theme: z.string().nullable(),
});

// Get design tokens response schema
export const GetDesignTokensResponseSchema = z.object({
  total: z.number(),
  filtered: z.number(),
  returned: z.number(),
  types: z.array(z.string()),
  tokens: z.array(DesignTokenSchema),
});

// Usage example schema
export const TokenUsageSchema = z.object({
  css: z.string(),
  pandacss: z.string(),
});

// Get design token detail response schema (success case)
export const GetDesignTokenDetailSuccessSchema = z.object({
  key: z.string(),
  exists: z.literal(true),
  path: z.array(z.string()),
  type: TokenTypeSchema,
  value: z.any(), // Can be string, number, or object (for typography tokens)
  originalValue: z.any(), // Can be string, number, or object
  category: TokenCategorySchema,
  theme: z.string().nullable(),
  cssVariable: z.string(),
  usage: TokenUsageSchema,
  references: z.string().nullable(),
});

// Get design token detail response schema (not found case)
export const GetDesignTokenDetailNotFoundSchema = z.object({
  key: z.string(),
  exists: z.literal(false),
  message: z.string(),
});

// Combined response schema
export const GetDesignTokenDetailResponseSchema = z.union([
  GetDesignTokenDetailSuccessSchema,
  GetDesignTokenDetailNotFoundSchema,
]);

// Type exports
export type TokenType = z.infer<typeof TokenTypeSchema>;
export type TokenCategory = z.infer<typeof TokenCategorySchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type DesignToken = z.infer<typeof DesignTokenSchema>;
export type GetDesignTokensResponse = z.infer<
  typeof GetDesignTokensResponseSchema
>;
export type GetDesignTokenDetailResponse = z.infer<
  typeof GetDesignTokenDetailResponseSchema
>;
