import { z } from "zod";

// セクションサマリのスキーマ
const SectionSummarySchema = z.object({
  id: z.string().describe("セクションID"),
  title: z.string().describe("セクションタイトル"),
  summary: z.string().describe("セクションの概要"),
  detailCommand: z.string().describe("詳細取得コマンド"),
});

// コンテキスト別ヘルプのスキーマ
const ContextualHelpSchema = z.record(
  z.array(z.string()).describe("関連セクションID配列")
);

// 次のステップのスキーマ
const NextStepSchema = z.object({
  message: z.string().describe("次のステップの説明"),
  command: z.string().describe("実行すべきコマンド"),
});

// 軽量版のレスポンススキーマ
export const SerendieUIOverviewResponseSchema = z.object({
  overview: z.string().describe("@serendie/uiの短い概要説明"),
  version: z.string().describe("現在のバージョン"),
  sections: z.array(SectionSummarySchema).describe("利用可能なセクション一覧"),
  contextualHelp: ContextualHelpSchema.describe("作業別の関連セクション"),
  nextStep: NextStepSchema.describe("次に実行すべきコマンド"),
});

export type SerendieUIOverviewResponse = z.infer<
  typeof SerendieUIOverviewResponseSchema
>;
