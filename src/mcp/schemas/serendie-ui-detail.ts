import { z } from "zod";

export const SectionIdSchema = z.enum([
  "architecture",
  "import-patterns",
  "styling-approach",
  "design-tokens",
  "component-categories",
  "common-patterns",
  "initial-setup",
  "package-relationships",
  "figma-integration",
  "component-defaults",
  "practical-examples",
  "best-practices",
]);

export const NextStepSchema = z.object({
  message: z.string().describe("次のステップの説明"),
  command: z.string().describe("実行すべきコマンド"),
});

export const SerendieUIDetailRequestSchema = z.object({
  section: SectionIdSchema.describe("取得するセクションID"),
});

export const SerendieUIDetailResponseSchema = z.object({
  section: SectionIdSchema.describe("セクションID"),
  title: z.string().describe("セクションタイトル"),
  progress: z.string().describe("進捗状況（例: 1/12）"),
  content: z.any().describe("セクション固有の詳細データ"),
  nextStep: NextStepSchema.optional().describe("次のセクション情報"),
});

export type SerendieUIDetailRequest = z.infer<
  typeof SerendieUIDetailRequestSchema
>;
export type SerendieUIDetailResponse = z.infer<
  typeof SerendieUIDetailResponseSchema
>;
