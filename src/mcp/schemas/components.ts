import { z } from "zod";

// Props定義のスキーマ
export const PropDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  description: z.string().optional(),
});

// コンポーネント例のスキーマ
export const ComponentExampleSchema = z.object({
  title: z.string(),
  description: z.string(),
  code: z.string(),
  fileName: z.string(),
  language: z.enum(["tsx", "jsx"]),
});

// Storybook URLのスキーマ
export const StorybookUrlSchema = z.object({
  title: z.string(),
  path: z.string(),
  variant: z.string().optional(),
  fullPath: z.string().optional(),
});

// コンポーネントサマリー（get-components用）
export const ComponentSummarySchema = z.object({
  name: z.string(),
  slug: z.string(),
  displayName: z.string(),
  description: z.string(),
  category: z.string(),
  relatedComponents: z.array(z.string()),
});

// get-componentsレスポンススキーマ
export const GetComponentsResponseSchema = z.object({
  total: z.number(),
  filtered: z.number(),
  returned: z.number(),
  categories: z.array(z.string()),
  components: z.array(ComponentSummarySchema),
});

// 関連コンポーネントのスキーマ
export const RelatedComponentSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  hasDocumentation: z.boolean(),
});

// コンポーネント詳細（get-component-detail用）
export const ComponentDetailSchema = z.object({
  name: z.string(),
  slug: z.string(),
  exists: z.literal(true),
  displayName: z.string(),
  description: z.string(),
  category: z.string(),
  lastUpdated: z.string(),
  documentationUrl: z.string().nullable(),
  importStatement: z.string(),
  props: z.array(PropDefinitionSchema),
  examples: z.array(ComponentExampleSchema),
  storybookUrls: z.array(
    StorybookUrlSchema.extend({
      fullPath: z.string(), // get-component-detailでは必須
    })
  ),
  usage: z.object({
    basic: z.string(),
    withProps: z.string().optional(),
  }),
  relatedComponents: z.array(z.string()),
});

// コンポーネントが存在しない場合のスキーマ
export const ComponentNotFoundSchema = z.object({
  name: z.string(),
  exists: z.literal(false),
  message: z.string(),
});

// get-component-detailレスポンススキーマ
// Combined response schema as a single object
// This allows .shape to be used for MCP outputSchema
export const GetComponentDetailResponseSchema = z.object({
  name: z.string(),
  exists: z.boolean(),
  // Success case fields (present when exists is true)
  slug: z.string().optional(),
  displayName: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  lastUpdated: z.string().optional(),
  documentationUrl: z.string().nullable().optional(),
  importStatement: z.string().optional(),
  props: z.array(PropDefinitionSchema).optional(),
  examples: z.array(ComponentExampleSchema).optional(),
  storybookUrls: z
    .array(
      StorybookUrlSchema.extend({
        fullPath: z.string(), // get-component-detailでは必須
      })
    )
    .optional(),
  usage: z
    .object({
      basic: z.string(),
      withProps: z.string().optional(),
    })
    .optional(),
  relatedComponents: z.array(z.string()).optional(),
  // Not found case field (present when exists is false)
  message: z.string().optional(),
});

// 型定義のエクスポート
export type PropDefinition = z.infer<typeof PropDefinitionSchema>;
export type ComponentExample = z.infer<typeof ComponentExampleSchema>;
export type StorybookUrl = z.infer<typeof StorybookUrlSchema>;
export type ComponentSummary = z.infer<typeof ComponentSummarySchema>;
export type RelatedComponent = z.infer<typeof RelatedComponentSchema>;
export type GetComponentsResponse = z.infer<typeof GetComponentsResponseSchema>;
export type ComponentDetail = z.infer<typeof ComponentDetailSchema>;
export type ComponentNotFound = z.infer<typeof ComponentNotFoundSchema>;
export type GetComponentDetailResponse = z.infer<
  typeof GetComponentDetailResponseSchema
>;
