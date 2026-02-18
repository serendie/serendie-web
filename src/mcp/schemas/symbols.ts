import { z } from "zod/v3";

// Symbol variant enum
export const SymbolVariantSchema = z.enum(["outlined", "filled"]);

// Get symbols response schema
export const GetSymbolsResponseSchema = z.object({
  total: z.number(),
  filtered: z.number(),
  variants: z.array(SymbolVariantSchema),
  symbols: z.array(z.string()),
});

// Usage examples schema
export const SymbolUsageSchema = z.object({
  basic: z.string(),
  outlined: z.string(),
  filled: z.string(),
});

// Get symbol detail response schema (success case)
export const GetSymbolDetailSuccessSchema = z.object({
  name: z.string(),
  exists: z.literal(true),
  variants: z.array(SymbolVariantSchema),
  importStatement: z.string(),
  usage: SymbolUsageSchema,
});

// Get symbol detail response schema (not found case)
export const GetSymbolDetailNotFoundSchema = z.object({
  name: z.string(),
  exists: z.literal(false),
  message: z.string(),
});

// Combined response schema - using z.object with optional fields to support .shape
export const GetSymbolDetailResponseSchema = z.object({
  name: z.string(),
  exists: z.boolean(),
  variants: z.array(SymbolVariantSchema).optional(),
  importStatement: z.string().optional(),
  usage: SymbolUsageSchema.optional(),
  message: z.string().optional(),
});

// Type exports
export type SymbolVariant = z.infer<typeof SymbolVariantSchema>;
export type GetSymbolsResponse = z.infer<typeof GetSymbolsResponseSchema>;
export type GetSymbolDetailResponse = z.infer<
  typeof GetSymbolDetailResponseSchema
>;
