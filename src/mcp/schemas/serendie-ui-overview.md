# @serendie/ui Overview

## 概要

@serendie/uiは三菱電機のSerendieデザインシステムをベースにしたReactコンポーネントライブラリです。
ユーザーは@serendie/uiをインストールし、いくつかの設定をすることで、Serendieデザインシステムに準拠したUIコンポーネントを利用できます。
また、PandaCSSのスタイルシステムが同梱されているため、プロジェクトにPandaCSSを導入することで独自のUIコンポーネントやスタイルを作成することもできます。

## 関連パッケージ

- @serendie/design-token
  - Serendieのデザイントークンを提供するパッケージ
  - PandaCSS用トークンの他に、CSS Variables形式、JSON形式でも提供されており、Serendie UIとは独立して使用することもできます。
  - Reactは使わないが、Serendie Design Systemを利用する場合などに活用できます。
  - 関連MCPツール: `get-design-tokens`, `get-design-token-detail`
- @serendie/symbols
  - デジタルプロダクトのなかで汎用性高く使える、Serendie らしい 300 種類以上のアイコンパッケージ
  - Serendie Symbols は React 環境を前提としています。
  - 関連MCPツール: `get-symbols`, `get-symbol-detail`
- @ark-ui/react
  - Serendie UIはヘッドレスUIライブラリであるArk UIを利用しています。
  - プロジェクトに導入する必要はありませんが、UIコンポーネントの細かな利用方法についてはArk UIのAPIリファレンスを参照してください。
- @pandacss/dev
  - Serendie UIはPandaCSSを利用しています。
  - プロジェクトに導入する必要はありませんが、独自にコンポーネントを作りたい場合などに統合的に利用できます。
  - PandaCSSの利用方法についてはPandaCSSのAPIリファレンスを参照してください。

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

## コンポーネントカテゴリ

- Actions (アクション): ボタンやボトムナビゲーションなど
- Inputs (入力): TextField、Select、Switchなど
- Layout (レイアウト): Accordion、Tabs、Dividerなど
- Display (表示): Avatar、Badge、ProgressIndicatorなど
- Feedback (フィードバック): Toast、ModalDialog、Paginationなど
- Other (その他)

コンポーネントのカテゴリは`get-components` MCPツールで確認できます。

## インポートパターン

### コンポーネント(@serendie/ui)

```tsx
import { Button } from "@serendie/ui";
```

### アイコン(@serendie/symbols)

```tsx
import {
  SerendieSymbolHome, // アウトライン
  SerendieSymbolSettingsFilled, // 塗りつぶし
} from "@serendie/symbols";
```

## テーマ

- 利用可能テーマ: `konjo`, `asagi`, `kurikawa`, `sumire`, `tsutsuji`
- デフォルトテーマ: `konjo`

htmlタグなどに、data-panda-theme属性 (konjo, asagi, sumire, tsutusji, kurikawa)を付与することで、CSS 環境であってもテーマを切り替えることができます。

## スタイリングアプローチ

PandaCSSをインストールして使うか、CSS Variablesを使うかを選択することができます。

### CSS Variables

@serendie/design-tokenをインストールして

```css
@import "@serendie/design-token/tokens.css";

h1 {
  font-size: var(--sd-reference-typography-scale-expanded-large);
  color: var(--sd-system-color-impression-primary);
}
```

のように指定することができます

### PandaCSS

@serendie/uiをインストールして

グローバルなCSSの先頭に

```css
@layer reset, base, tokens, recipes, utilities;
@import "@serendie/ui/styles.css";
```

を記述して下さい。

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

## ベストプラクティス

- デザイントークン（特にスペーシング）を必ず使用する
- `px`値の直接指定は禁止
- Reset CSSは追加不要（既に同梱）
- `@serendie/ui`, `@serendie/design-token`, `@serendie/symbols` を組み合わせて利用
- Figma Variablesと自動同期される前提で運用する
- デザイントークン選択時は`get-design-tokens` MCPツールで対応可能なトークンを確認する

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
