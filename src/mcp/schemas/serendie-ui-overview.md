# @serendie/ui Overview

## 概要

@serendie/uiは三菱電機のReactベースデザインシステムで、PandaCSSと統合済みのコンポーネントライブラリです。既にアクセシビリティに配慮したArk UIベースのコンポーネントやデザイントークンが整備されているため、追加のReset CSSや独自トークンの定義は不要です。

## バージョン

- 現行バージョン: `1.0.1`

## アーキテクチャ

- フレームワーク: React 18 + PandaCSS
- スタイリング: PandaCSS + `@serendie/ui`プリセット
- 主要依存パッケージ:
  - `@ark-ui/react`: ヘッドレスUIプリミティブ
  - `@serendie/design-token`: デザイントークン群
  - `@serendie/symbols`: アイコンライブラリ

## コンポーネントカテゴリ

- Actions (アクション): ボタンやボトムナビゲーションなど
- Inputs (入力): TextField、Select、Switchなど
- Layout (レイアウト): Accordion、Tabs、Dividerなど
- Display (表示): Avatar、Badge、ProgressIndicatorなど
- Feedback (フィードバック): Toast、ModalDialog、Paginationなど
- Other (その他)

## インポートパターン

- コンポーネント: `import { ComponentName } from '@serendie/ui'`
  - 例: `import { Button } from '@serendie/ui'`
  - 補足: ファイル名はPascalCase、クラス名はkebab-caseで出力
- アイコン: `import { SerendieSymbol } from '@serendie/symbols'`
  - JSX使用例: `<SerendieSymbol name="activity" variant="outlined" />`
  - 利用可能バリアント: _(default)_ / `outlined` / `filled`
  - SerendieSymbolコンポーネントのみを使用すること

## テーマ

- 利用可能テーマ: `asagi`, `konjo`, `kurikawa`, `sumire`, `tsutsuji`
- デフォルトテーマ: `asagi`
- PandayCSS設定で`theme`を指定して切り替え

## スタイリングアプローチ

- 基本メソッド: `css()`, `sva()`, `textStyle`
- トークン参照: `styled-system`経由で `sd.system.*` を利用
- スニペット:
  ```ts
  css({
    p: "sd.system.dimension.spacing.medium",
    color: "sd.system.color.impression.primary",
  });
  ```
- タイポグラフィ例: `textStyle: 'sd.system.typography.headline.small_expanded'`

## 開発ガイドライン

- デザイントークンを必ず使用する
- 既存コンポーネントを優先採用する
- アクセシビリティ要件を確実に満たす

## 共通パターン

- Props
  - `variant`: `solid` / `outline` / `ghost`
  - `size`: `xs` / `sm` / `md` / `lg` / `xl`
  - `colorScheme`: `primary`, `secondary` など
  - `asChild`: ラップ要素の置換に使用
- Composition: Ark UIのコンポジションパターンに準拠

## 参考リソース

- ドキュメント: https://serendie.design/
- Storybook: https://storybook.serendie.design/
- GitHub: https://github.com/serendie/serendie
- Figma: https://www.figma.com/community/file/1433690846108785966/serendie-ui-kit

## ベストプラクティス

- デザイントークン（特にスペーシング）を必ず使用する
- `px`値の直接指定は禁止
- Reset CSSは追加不要（既に同梱）
- `@serendie/ui`, `@serendie/design-token`, `@serendie/symbols` を組み合わせて利用
- Figma Variablesと自動同期される前提で運用する
- デザイントークン選択時は`get-design-tokens` MCPツールで対応可能なトークンを確認する

## 初期セットアップ

- 概要: 最小限の設定で始められる
- 手順:
  1. `npm install @serendie/ui @serendie/design-token @serendie/symbols`
  2. PandaCSS設定に`@serendie/ui`プリセットを追加
- 禁止事項:
  - Reset CSSを追加しない
  - `box-sizing` の個別設定は不要
  - 独自スペーシング値を定義しない（必ずトークンを使用）

## パッケージ関係性

- 全体像: 3パッケージが連携してデザイン〜実装を接続
- 役割:
  - `@serendie/ui`: UIコンポーネントを提供（MCPツール: `get-components`）
  - `@serendie/design-token`: 設計値を管理（MCPツール: `get-design-tokens`）
  - `@serendie/symbols`: アイコンを提供（MCPツール: `get-symbols`）
- デザインフロー: Figma Variables → design-token → UI → App

## デザイントークンガイドライン

- 重要性: デザイントークンは必須。`px`値やリファレンストークンの直接使用は禁止
- トークン種別:
  - リファレンス (`sd.reference.*`): 生の値。直接使用禁止
  - システム (`sd.system.*`): リファレンスを参照。実装では必ずこちらを使用
- 優先事項:
  - システムトークン(`sd.system.`)を最優先で利用
  - `sd.reference.`の直接使用は禁止
  - スペーシングは`sd.system.dimension.spacing.*`を利用
  - 色指定は`sd.system.color.*`を利用（HEX禁止）
- よくある誤り:
  - `padding: '16px'` → `p: 'sd.system.dimension.spacing.*'`
  - `color: '#333'` → `color: 'sd.system.color.component.onSurface'`
  - `color: 'sd.reference.color.scale.gray.500'` → `color: 'sd.system.color.component.onSurface'`
  - `margin: 8` → `m: 'sd.system.dimension.spacing.*'`
- 正しい例:
  ```ts
  css({
    p: "sd.system.dimension.spacing.medium",
    color: "sd.system.color.component.onSurface",
  });
  ```
- 注意: 具体的なトークン一覧は`get-design-tokens`ツールで確認

## スペーシングマッピング

- 指針:
  - 数値や`px`指定は使用しない
  - `sd.system.dimension.spacing.*`を利用
  - `type: 'dimension'`, `category: 'system'`でフィルタ可能
  - MCP例: `get-design-tokens({ type: 'dimension', category: 'system' })`
- 使用例:
  - `p: 'sd.system.dimension.spacing.medium'`
  - `gap: 'sd.system.dimension.spacing.large'`
  - `m: 'sd.system.dimension.spacing.extraSmall'`
  - `py: 'sd.system.dimension.spacing.small'`

## Figma統合

- 概要: Figma Variablesとデザイントークンを自動同期
- Figma Variables: トークン変更が自動でコードへ反映
- Code Connect: 実装コードを直接参照可能
- ワークフロー: 必要に応じて追加予定

## コンポーネントのデフォルト設定

- TextField: `maxWidth`が既定で設定されている → `className={css({ width: '100%' })}`で解除
- PasswordField: TextFieldと同様に`maxWidth`設定 → `className={css({ width: '100%' })}`で解除

## 実践例

### ログインフォーム

```tsx
<div
  className={css({
    display: "flex",
    flexDirection: "column",
    gap: "sd.system.dimension.spacing.large",
  })}
>
  <TextField label="ユーザー名" className={css({ width: "100%" })} />
  <PasswordField label="パスワード" className={css({ width: "100%" })} />
  <Button
    className={css({ width: "100%" })}
    variant="solid"
    colorScheme="primary"
  >
    ログイン
  </Button>
</div>
```

- `className`と`css()`で既定の`maxWidth`制限を解除
- スペーシングはデザイントークンを使用

### レスポンシブカードレイアウト

```tsx
<div
  className={css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "sd.system.dimension.spacing.extraLarge",
  })}
>
  {items.map((item) => (
    <div
      key={item.id}
      className={css({
        padding: "sd.system.dimension.spacing.large",
        backgroundColor: "sd.system.color.component.surface",
        borderRadius: "sd.system.dimension.radius.medium",
        boxShadow: "sd.system.elevation.shadow.level1",
      })}
    >
      <h3
        className={css({
          textStyle: "sd.system.typography.headline.small_expanded",
          marginBottom: "sd.system.dimension.spacing.small",
        })}
      >
        {item.title}
      </h3>
      <p
        className={css({
          color: "sd.system.color.component.onSurfaceVariant",
        })}
      >
        {item.description}
      </p>
    </div>
  ))}
</div>
```

- `textStyle`でタイポグラフィトークンを適用
- スペーシングと色は必ずデザイントークンを使用
