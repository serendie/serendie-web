import { getCategoryDescriptions } from "./component-categories.js";

export type SectionId =
  | "architecture"
  | "import-patterns"
  | "styling-approach"
  | "design-tokens"
  | "component-categories"
  | "common-patterns"
  | "initial-setup"
  | "package-relationships"
  | "figma-integration"
  | "component-defaults"
  | "practical-examples"
  | "best-practices";

export interface SectionSummary {
  id: SectionId;
  title: string;
  summary: string;
  detailCommand: string;
}

export interface SectionDetail {
  id: SectionId;
  title: string;
  content: unknown;
}

export const SECTION_ORDER: SectionId[] = [
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
];

export const SECTION_SUMMARIES: SectionSummary[] = [
  {
    id: "architecture",
    title: "アーキテクチャ",
    summary: "React 18 + PandaCSS + Ark UIベースの設計",
    detailCommand: "get-serendie-ui-detail({ section: 'architecture' })",
  },
  {
    id: "import-patterns",
    title: "インポートパターン",
    summary: "コンポーネントとアイコンのインポート方法",
    detailCommand: "get-serendie-ui-detail({ section: 'import-patterns' })",
  },
  {
    id: "styling-approach",
    title: "スタイリング方法",
    summary: "PandaCSSを使用したスタイル定義",
    detailCommand: "get-serendie-ui-detail({ section: 'styling-approach' })",
  },
  {
    id: "design-tokens",
    title: "デザイントークンガイドライン",
    summary: "必須のトークン使用ルールと実例",
    detailCommand: "get-serendie-ui-detail({ section: 'design-tokens' })",
  },
  {
    id: "component-categories",
    title: "コンポーネントカテゴリ",
    summary: "Actions, Inputs, Layout, Display, Feedback, Other",
    detailCommand:
      "get-serendie-ui-detail({ section: 'component-categories' })",
  },
  {
    id: "common-patterns",
    title: "共通パターン",
    summary: "Props設計とコンポジションパターン",
    detailCommand: "get-serendie-ui-detail({ section: 'common-patterns' })",
  },
  {
    id: "initial-setup",
    title: "初期セットアップ",
    summary: "インストールと設定手順",
    detailCommand: "get-serendie-ui-detail({ section: 'initial-setup' })",
  },
  {
    id: "package-relationships",
    title: "パッケージ関係性",
    summary: "@serendie/ui, design-token, symbolsの連携",
    detailCommand:
      "get-serendie-ui-detail({ section: 'package-relationships' })",
  },
  {
    id: "figma-integration",
    title: "Figma統合",
    summary: "Figma VariablesとCode Connectの活用",
    detailCommand: "get-serendie-ui-detail({ section: 'figma-integration' })",
  },
  {
    id: "component-defaults",
    title: "コンポーネントデフォルト",
    summary: "TextField等のデフォルトスタイル設定",
    detailCommand: "get-serendie-ui-detail({ section: 'component-defaults' })",
  },
  {
    id: "practical-examples",
    title: "実践例",
    summary: "ログインフォームやレスポンシブレイアウト",
    detailCommand: "get-serendie-ui-detail({ section: 'practical-examples' })",
  },
  {
    id: "best-practices",
    title: "ベストプラクティス",
    summary: "開発時の重要な注意点とルール",
    detailCommand: "get-serendie-ui-detail({ section: 'best-practices' })",
  },
];

export function getSectionDetail(sectionId: SectionId): SectionDetail | null {
  switch (sectionId) {
    case "architecture":
      return {
        id: "architecture",
        title: "アーキテクチャ",
        content: {
          framework: "React 18ベースのコンポーネントライブラリ",
          styling: "PandaCSS + @serendie/uiプリセット",
          dependencies: {
            "@ark-ui/react":
              "ヘッドレスUIプリミティブ - 基盤となるアクセシブルなUI構造を提供",
            "@serendie/design-token":
              "デザイントークン - Figmaと同期された設計値",
            "@serendie/symbols":
              "アイコンライブラリ - Material Symbolsベースのアイコンセット",
          },
          keyFeatures: [
            "完全なTypeScript対応",
            "ツリーシェイキング対応",
            "サーバーサイドレンダリング対応",
            "アクセシビリティ（WAI-ARIA）準拠",
          ],
        },
      };

    case "import-patterns":
      return {
        id: "import-patterns",
        title: "インポートパターン",
        content: {
          component: {
            pattern: "import { ComponentName } from '@serendie/ui'",
            example: "import { Button, TextField, Dialog } from '@serendie/ui'",
            note: "コンポーネント名はPascalCase、HTMLタグはkebab-case変換される",
          },
          icons: {
            import: "import { SerendieSymbol } from '@serendie/symbols'",
            usage: '<SerendieSymbol name="activity" variant="outlined" />',
            variants: ["", "outlined", "filled"],
            availableIcons: "get-symbolsツールで全アイコン一覧を確認可能",
            note: "個別アイコンコンポーネントは非推奨。SerendieSymbolコンポーネントのみを使用",
          },
        },
      };

    case "styling-approach":
      return {
        id: "styling-approach",
        title: "スタイリング方法",
        content: {
          method: "PandaCSS",
          patterns: {
            css: "基本的なスタイリング関数",
            sva: "Slot Variant API - コンポーネントバリアント定義",
            textStyle: "タイポグラフィトークンの適用",
          },
          tokens: "styled-system経由でアクセス",
          examples: {
            basic:
              "css({ p: 'sd.system.dimension.spacing.medium', color: 'sd.system.color.impression.primary' })",
            typography:
              "css({ textStyle: 'sd.system.typography.headline.small_expanded' })",
            responsive:
              "css({ p: { base: 'sd.system.dimension.spacing.small', md: 'sd.system.dimension.spacing.medium' } })",
          },
          important: [
            "px値の直接指定は禁止",
            "必ずデザイントークンを使用",
            "textStyleでタイポグラフィを統一",
          ],
        },
      };

    case "design-tokens":
      return {
        id: "design-tokens",
        title: "デザイントークンガイドライン",
        content: {
          importance:
            "必須。px値や直接的な色指定は禁止。リファレンストークンの直接使用も禁止。",
          tokenTypes: {
            reference: {
              description: "生の設計値（color.scale.green.500等）",
              usage: "直接使用禁止。システムトークンの参照元",
            },
            system: {
              description: "意味的な値（color.impression.primary等）",
              usage: "必ずこちらを使用。テーマ変更に対応",
            },
          },
          priority: [
            "必ずシステムトークン（sd.system.）を使用",
            "リファレンストークン（sd.reference.）は直接使用禁止",
            "スペーシング: sd.system.dimension.spacing.*を使用",
            "色: sd.system.color.* を使用（HEX値禁止）",
          ],
          commonMistakes: [
            {
              bad: "padding: '16px'",
              good: "p: 'sd.system.dimension.spacing.medium'",
            },
            {
              bad: "color: '#333'",
              good: "color: 'sd.system.color.component.onSurface'",
            },
            {
              bad: "color: 'sd.reference.color.scale.gray.500'",
              good: "color: 'sd.system.color.component.onSurface'",
            },
          ],
          spacingTokens: {
            overview: "数値の直接指定は禁止。必ずトークンを使用",
            available: [
              "sd.system.dimension.spacing.extraSmall (4px)",
              "sd.system.dimension.spacing.small (8px)",
              "sd.system.dimension.spacing.medium (16px)",
              "sd.system.dimension.spacing.large (24px)",
              "sd.system.dimension.spacing.extraLarge (32px)",
            ],
            usage:
              "get-design-tokens({ type: 'dimension', category: 'system' })で全トークン確認",
          },
        },
      };

    case "component-categories":
      return {
        id: "component-categories",
        title: "コンポーネントカテゴリ",
        content: getCategoryDescriptions(),
      };

    case "common-patterns":
      return {
        id: "common-patterns",
        title: "共通パターン",
        content: {
          props: {
            variant: {
              description: "表示バリエーション",
              values: "solid/outline/ghost/subtle等",
            },
            size: {
              description: "サイズバリエーション",
              values: "xs/sm/md/lg/xl",
            },
            colorScheme: {
              description: "カラースキーム",
              values: "primary/secondary/success/danger等",
            },
            asChild: {
              description: "要素置換パターン",
              usage: "カスタム要素でコンポーネントをレンダリング",
            },
          },
          composition: {
            pattern: "Ark UI準拠のコンポジションAPI",
            example: `<Dialog.Root>
  <Dialog.Trigger>開く</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>タイトル</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>内容</Dialog.Body>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Portal>
</Dialog.Root>`,
          },
        },
      };

    case "initial-setup":
      return {
        id: "initial-setup",
        title: "初期セットアップ",
        content: {
          overview: "最小限の設定で開始可能",
          steps: [
            {
              step: 1,
              title: "パッケージインストール",
              command:
                "npm install @serendie/ui @serendie/design-token @serendie/symbols",
            },
            {
              step: 2,
              title: "PandaCSS設定",
              code: `// panda.config.ts
import { defineConfig } from '@pandacss/dev'
import serendiePreset from '@serendie/ui/preset'

export default defineConfig({
  presets: [serendiePreset],
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
})`,
            },
            {
              step: 3,
              title: "使用開始",
              code: `import { Button } from '@serendie/ui'

export function App() {
  return <Button>開始</Button>
}`,
            },
          ],
          warnings: [
            "リセットCSSは追加禁止（@serendie/uiに含まれている）",
            "box-sizingの設定不要（自動設定済み）",
            "独自のスペーシングシステムは作らない",
          ],
        },
      };

    case "package-relationships":
      return {
        id: "package-relationships",
        title: "パッケージ関係性",
        content: {
          overview: "3つのパッケージが密接に連携",
          packages: {
            "@serendie/ui": {
              description: "UIコンポーネントライブラリ",
              role: "React コンポーネントの提供",
              mcpTool: "get-components, get-component-detail",
              dependencies: ["@serendie/design-token", "@ark-ui/react"],
            },
            "@serendie/design-token": {
              description: "デザイントークン",
              role: "色、スペーシング、タイポグラフィなどの設計値",
              mcpTool: "get-design-tokens, get-design-token-detail",
              sync: "Figma Variablesと自動同期",
            },
            "@serendie/symbols": {
              description: "アイコンライブラリ",
              role: "Material Symbolsベースのアイコンセット",
              mcpTool: "get-symbols, get-symbol-detail",
              variants: "3種類のバリアント提供",
            },
          },
          designFlow: "Figma Variables → design-token → UI → アプリケーション",
        },
      };

    case "figma-integration":
      return {
        id: "figma-integration",
        title: "Figma統合",
        content: {
          overview: "デザインと実装の完全な同期",
          figmaVariables: {
            description: "デザイントークンの自動更新",
            flow: "Figma Variables変更 → design-tokenパッケージ自動更新",
            benefit: "デザイナーの変更が即座にコードに反映",
          },
          codeConnect: {
            description: "実装コードの直接参照",
            usage: "Figmaから実際のReactコードを確認可能",
            benefit: "デザイナーと開発者の認識齟齬を削減",
          },
          resources: {
            figmaKit:
              "https://www.figma.com/community/file/1433690846108785966/serendie-ui-kit",
            documentation: "https://serendie.design/",
          },
        },
      };

    case "component-defaults":
      return {
        id: "component-defaults",
        title: "コンポーネントデフォルト",
        content: {
          overview:
            "一部のコンポーネントにはデフォルトスタイルが設定されている",
          components: {
            TextField: {
              defaults: ["maxWidthが設定されている"],
              override: {
                method: "classNameプロパティでスタイルを上書き",
                example: `<TextField 
  label="ユーザー名" 
  className={css({ width: '100%' })} 
/>`,
              },
            },
            PasswordField: {
              defaults: ["maxWidthが設定されている"],
              override: {
                method: "classNameプロパティでスタイルを上書き",
                example: `<PasswordField 
  label="パスワード" 
  className={css({ width: '100%' })} 
/>`,
              },
            },
          },
          guidance:
            "フォーム要素を全幅にしたい場合は、className={css({ width: '100%' })}を追加",
        },
      };

    case "practical-examples":
      return {
        id: "practical-examples",
        title: "実践例",
        content: {
          overview: "実際のユースケースに基づいた実装例",
          examples: [
            {
              title: "ログインフォーム",
              description: "ユーザー認証画面の実装",
              code: `import { TextField, PasswordField, Button } from '@serendie/ui'
import { css } from 'styled-system/css'

export function LoginForm() {
  return (
    <div className={css({ 
      display: "flex", 
      flexDirection: "column", 
      gap: "sd.system.dimension.spacing.large",
      maxWidth: "400px",
      margin: "0 auto",
      padding: "sd.system.dimension.spacing.extraLarge"
    })}>
      <h1 className={css({ 
        textStyle: "sd.system.typography.headline.large_expanded" 
      })}>
        ログイン
      </h1>
      
      <TextField 
        label="ユーザー名" 
        className={css({ width: "100%" })} 
        required
      />
      
      <PasswordField 
        label="パスワード" 
        className={css({ width: "100%" })} 
        required
      />
      
      <Button 
        className={css({ width: "100%" })} 
        variant="solid" 
        colorScheme="primary"
      >
        ログイン
      </Button>
    </div>
  )
}`,
              notes: [
                "フィールドのwidth: 100%でmaxWidth制限を解除",
                "gap, paddingはデザイントークンを使用",
                "textStyleでタイポグラフィを統一",
              ],
            },
            {
              title: "レスポンシブカードグリッド",
              description: "自動調整されるカードレイアウト",
              code: `import { css } from 'styled-system/css'

export function CardGrid({ items }) {
  return (
    <div className={css({ 
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "sd.system.dimension.spacing.extraLarge"
    })}>
      {items.map(item => (
        <article 
          key={item.id} 
          className={css({ 
            padding: "sd.system.dimension.spacing.large",
            backgroundColor: "sd.system.color.component.surface",
            borderRadius: "sd.system.dimension.radius.medium",
            boxShadow: "sd.system.elevation.shadow.level1",
            transition: "box-shadow 0.2s",
            "&:hover": {
              boxShadow: "sd.system.elevation.shadow.level2"
            }
          })}
        >
          <h3 className={css({ 
            textStyle: "sd.system.typography.headline.small_expanded",
            marginBottom: "sd.system.dimension.spacing.small"
          })}>
            {item.title}
          </h3>
          <p className={css({ 
            color: "sd.system.color.component.onSurfaceVariant"
          })}>
            {item.description}
          </p>
        </article>
      ))}
    </div>
  )
}`,
              notes: [
                "CSS Gridでレスポンシブ対応",
                "elevationトークンで影を統一",
                "ホバー効果でインタラクティブ性を向上",
              ],
            },
          ],
        },
      };

    case "best-practices":
      return {
        id: "best-practices",
        title: "ベストプラクティス",
        content: {
          critical: [
            "必ず get-serendie-ui-overview を最初に実行",
            "デザイントークンを必ず使用（px値禁止）",
            "リセットCSSを追加しない（含まれている）",
            "@serendie/ui の既存コンポーネントを優先使用",
          ],
          development: [
            "コンポーネント探索: get-components ツールを使用",
            "トークン探索: get-design-tokens ツールを使用",
            "アイコン探索: get-symbols ツールを使用",
            "不明な点はMCPツールで確認",
          ],
          styling: [
            "css()関数でスタイリング",
            "textStyleでタイポグラフィトークン適用",
            "システムトークン（sd.system.）のみ使用",
            "リファレンストークン（sd.reference.）は使用禁止",
          ],
          accessibility: [
            "Ark UIベースのアクセシブルな実装",
            "適切なARIAラベルの設定",
            "キーボードナビゲーション対応",
            "スクリーンリーダー対応",
          ],
        },
      };

    default:
      return null;
  }
}

export function getContextualHelp(): Record<string, SectionId[]> {
  return {
    forStyling: ["styling-approach", "design-tokens"],
    forComponents: [
      "component-categories",
      "import-patterns",
      "common-patterns",
    ],
    forSetup: ["initial-setup", "package-relationships"],
    forDesign: ["figma-integration", "design-tokens"],
    forForms: ["component-defaults", "practical-examples"],
  };
}

export function getNextSection(currentSectionId: SectionId): SectionId | null {
  const currentIndex = SECTION_ORDER.indexOf(currentSectionId);
  if (currentIndex === -1 || currentIndex === SECTION_ORDER.length - 1) {
    return null;
  }
  return SECTION_ORDER[currentIndex + 1];
}

export function getSectionProgress(sectionId: SectionId): string {
  const index = SECTION_ORDER.indexOf(sectionId);
  if (index === -1) return "";
  return `${index + 1}/${SECTION_ORDER.length}`;
}
