import { z } from "zod";

// 依存関係のスキーマ
const DependencyInfoSchema = z.object({
  "@ark-ui/react": z.string().describe("ヘッドレスUIプリミティブ"),
  "@serendie/design-token": z.string().describe("デザイントークン"),
  "@serendie/symbols": z.string().describe("アイコンライブラリ"),
});

// アーキテクチャ情報のスキーマ
const ArchitectureSchema = z.object({
  framework: z.string().describe("フレームワークの説明"),
  styling: z.string().describe("スタイリング方法"),
  dependencies: DependencyInfoSchema,
});

// インポートパターンのスキーマ
const ImportPatternSchema = z.object({
  pattern: z.string().describe("インポートパターンのテンプレート"),
  example: z.string().describe("具体的な例"),
  note: z.string().optional().describe("補足説明"),
});

const IconImportSchema = z.object({
  pattern: z.string().describe("アイコンのインポートパターン"),
  example: z.string().describe("具体的な例"),
  variants: z.array(z.string()).describe("利用可能なバリアント"),
});

// テーマ情報のスキーマ
const ThemeInfoSchema = z.object({
  available: z.array(
    z.enum(["asagi", "konjo", "kurikawa", "sumire", "tsutsuji"])
  ),
  default: z.string(),
  usage: z.string().describe("テーマの使用方法"),
});

// スタイリング方法のスキーマ
const StylingApproachSchema = z.object({
  method: z.string(),
  patterns: z.array(z.string()),
  tokens: z.string(),
  example: z.string(),
  textStyles: z.string().optional(),
});

// 一般的なPropsパターンのスキーマ
const CommonPropsSchema = z.object({
  variant: z.string().describe("表示バリエーションの説明"),
  size: z.string().describe("サイズバリエーションの説明"),
  colorScheme: z.string().describe("カラースキームの説明"),
  asChild: z.string().describe("要素置換パターンの説明"),
});

// リソース情報のスキーマ
const ResourcesSchema = z.object({
  documentation: z.string().url(),
  storybook: z.string().url(),
  github: z.string().url(),
  figma: z.string(),
});

// 初期セットアップのスキーマ
const InitialSetupSchema = z.object({
  overview: z.string(),
  steps: z.array(z.string()),
  warnings: z.array(z.string()),
  doNotDo: z.array(z.string()),
});

// パッケージ関係性のスキーマ
const PackageRelationshipsSchema = z.object({
  overview: z.string(),
  packages: z.record(
    z.object({
      description: z.string(),
      role: z.string(),
      mcpTool: z.string().optional(),
    })
  ),
  designFlow: z.string(),
});

// デザイントークンガイドラインのスキーマ
const DesignTokenGuidelinesSchema = z.object({
  importance: z.string(),
  tokenTypes: z
    .object({
      reference: z.string(),
      system: z.string(),
    })
    .optional(),
  priority: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  examples: z.object({
    correct: z.object({
      good: z.string(),
      bad: z.string(),
      veryBad: z.string().optional(),
    }),
  }),
  spacingMapping: z
    .object({
      overview: z.string(),
      guideline: z.array(z.string()),
      usage: z.string(),
      examples: z.array(z.string()),
    })
    .optional(),
});

// Figma統合のスキーマ
const FigmaIntegrationSchema = z.object({
  overview: z.string(),
  figmaVariables: z.string(),
  codeConnect: z.string(),
  workflow: z.array(z.string()),
});

// コンポーネントのデフォルトスタイルのスキーマ
const ComponentDefaultsSchema = z.object({
  overview: z.string(),
  components: z.record(
    z.object({
      defaults: z.array(z.string()),
      override: z.string().optional(),
    })
  ),
});

// 実践的な使用例のスキーマ
const PracticalExamplesSchema = z.object({
  overview: z.string(),
  examples: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      code: z.string(),
      notes: z.array(z.string()).optional(),
    })
  ),
});

// 全体のレスポンススキーマ
export const SerendieUIOverviewResponseSchema = z.object({
  overview: z.string().describe("@serendie/uiの概要説明"),
  version: z.string().describe("現在のバージョン"),
  architecture: ArchitectureSchema,
  componentCategories: z.record(z.string()).describe("カテゴリと説明のマップ"),
  importPatterns: z.object({
    component: ImportPatternSchema,
    icons: IconImportSchema,
  }),
  themes: ThemeInfoSchema,
  stylingApproach: StylingApproachSchema,
  developmentGuidelines: z.array(z.string()),
  commonPatterns: z.object({
    props: CommonPropsSchema,
    composition: z.string(),
  }),
  resources: ResourcesSchema,
  bestPractices: z.array(z.string()),
  initialSetup: InitialSetupSchema,
  packageRelationships: PackageRelationshipsSchema,
  designTokenGuidelines: DesignTokenGuidelinesSchema,
  figmaIntegration: FigmaIntegrationSchema,
  componentDefaults: ComponentDefaultsSchema.optional(),
  practicalExamples: PracticalExamplesSchema.optional(),
});

export type SerendieUIOverviewResponse = z.infer<
  typeof SerendieUIOverviewResponseSchema
>;
