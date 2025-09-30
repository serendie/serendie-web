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
  - 汎用性の高い 300 種類以上のアイコンパッケージ
  - Serendie Symbols は React 環境を前提としています。
  - 関連MCPツール: `get-symbols`, `get-symbol-detail`
- @ark-ui/react
  - Serendie UIはヘッドレスUIライブラリであるArk UIを利用しています。
  - プロジェクトに導入する必要はありませんが、UIコンポーネントの細かな利用方法についてはArk UIのAPIリファレンスを参照してください。
    - LLMs TXT: https://ark-ui.com/llms.txt
- @pandacss/dev
  - Serendie UIはPandaCSSを利用しています。
  - プロジェクトに導入する必要はありませんが、独自にコンポーネントを作りたい場合などに統合的に利用できます。
  - PandaCSSの利用方法についてはPandaCSSのAPIリファレンスを参照してください。
    - LLMs TXT: https://panda-css.com/llms.txt

## コンポーネントカテゴリ

- Actions (アクション): ボタンやボトムナビゲーションなど
- Inputs (入力): TextField、Select、Switchなど
- Layout (レイアウト): Accordion、Tabs、Dividerなど
- Display (表示): Avatar、Badge、ProgressIndicatorなど
- Feedback (フィードバック): Toast、ModalDialog、Paginationなど
- Other (その他)

コンポーネントのカテゴリは`get-components` MCPツールで確認できます。

## @serendie/uiのセットアップ

### 前提

- React環境がセットアップ済

### 手順

1. `npm install @serendie/ui`
2. CSS設定に

   ```
   @layer reset, base, tokens, recipes, utilities;
   @serendie/ui/styles.css
   ```

   を追加してください。

3. `@serendie/ui`や`@serendie/ui/jsx`から必要なコンポーネントをインポートして利用してください。

```tsx
import { Button } from "@serendie/ui";
import { Box } from "@serendie/ui/jsx";

//...snip...
return (
  <Box
    alignItems="center"
    justifyContent="center"
    display="flex"
    flexDirection="column"
  >
    <Button onClick={() => setCount(count + 1)}>Hello {count}</Button>
  </Box>
);
//...snip...
```

## CSS Variablesを利用する

Panda CSSの仕様上、@serendie/uiパッケージには「ビルド済みのCSSのみ」が同梱されているため、

```tsx
  <Box my="sd.system.dimension.spacing.sixExtraLarge">
```

のように、serendie/ui内部で指定していないクラス名は生成されていません(事前にビルドすると膨大なCSSが生成されるため)
ただし、それぞれの値はCSS Variablesを使って取得することができます。

```css
.my-class {
  font-size: var(--sd-reference-typography-scale-expanded-large);
  color: var(--sd-system-color-impression-primary);
  margin: var(--sd-system-dimension-spacing-sixExtraLarge);
}
```

```tsx
  <Box className="my-class">
```

プロジェクトの制約によりPandaCSSを利用できない場合は、CSS Variablesを利用してください。

## PandaCSSを利用する(推奨)

プロジェクトにPandaCSSを導入すると、よりシームレスにSerendie UIを利用することができます。

### インストール

```
npm install -D @pandacss/dev
npx panda init --postcss
```

package.jsonに以下を追加します

````diff
{
  "scripts": {
+   "prepare": "panda codegen",
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}


### 設定

panda initで生成されたpanda.config.tsに設定を追加します

```diff
+import { SerendiePreset } from "@serendie/ui";

export default defineConfig({
+  jsxFramework: "react",
+  presets: [SerendiePreset],
});

````

これで

```tsx
  <Box my="sd.system.dimension.spacing.sixExtraLarge">
```

などに対応するCSSが生成されます。
また、css()メソッドを利用しても同様のことができます。

```tsx
import { css } from "@serendie/ui/css";
// ...snip...
<div className={css({ my: "sd.system.dimension.spacing.sixExtraLarge" })}>
```

## Serendie Symbolsのセットアップ

1. `npm install @serendie/symbols`
2. `@serendie/symbols`から必要なシンボルをインポートして利用してください。

```tsx
import {
  SerendieSymbolHome, // アウトライン
  SerendieSymbolSettingsFilled, // 塗りつぶし
} from "@serendie/symbols";
```

どのようなシンボルがあるかは MCPツール`get-symbols`、`get-symbol-detail`で確認できます。

## カラーテーマ

htmlタグなどに、data-panda-theme属性を付与することで、CSS 環境であってもテーマを切り替えることができます。

```html
<html data-panda-theme="asagi"></html>
```

- 利用可能テーマ: `konjo`, `asagi`, `kurikawa`, `sumire`, `tsutsuji`
- デフォルトテーマ: `konjo`

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
- Reset CSSは追加不要（同梱済）
- `@serendie/ui` と `@serendie/symbols` を組み合わせて利用
- デザイントークン選択時は`get-design-tokens` MCPツールで対応可能なトークンを確認する
- TypeScriptの型チェックを活用してコンポーネントのpropsなどに間違いがないかを確認する

## デザイントークンガイドライン

- デザイントークンは必須。`px`値やリファレンストークンの直接使用は禁止
- トークン種別:
  - リファレンス (`sd.reference.*`): 生の値。直接使用禁止
  - システム (`sd.system.*`): リファレンスを参照。実装では必ずこちらを使用
- 優先事項:
  - システムトークン(`sd.system.`)を最優先で利用
  - `sd.reference.`の直接使用は禁止
  - スペーシングは`sd.system.dimension.spacing.*`を利用
  - 色指定は`sd.system.color.*`を利用（HEX禁止）
  - `textStyle`でタイポグラフィトークンを適用
  - スペーシングと色は必ずデザイントークンを使用
- よくある誤り:
  - `padding: '16px'` → `p: 'sd.system.dimension.spacing.*'`
  - `color: '#333'` → `color: 'sd.system.color.component.onSurface'`
  - `color: 'sd.reference.color.scale.gray.500'` → `color: 'sd.system.color.component.onSurface'`
  - `margin: 8` → `m: 'sd.system.dimension.spacing.*'`
  - `font-size: 16px` → `textStyle: 'sd.system.typography.scale.expanded.large'`
- 正しい例:
  ```ts
  css({
    p: "sd.system.dimension.spacing.medium",
    color: "sd.system.color.component.onSurface",
    textStyle: "sd.system.typography.headline.small_expanded",
  });
  ```
- 注意: 具体的なトークン一覧は`get-design-tokens`ツールで確認

## TIPS

### コンポーネントのデフォルト設定

- TextField: `maxWidth`が既定で設定されている → `className={css({ width: '100%' })}`で解除
- PasswordField: TextFieldと同様に`maxWidth`設定 → `className={css({ width: '100%' })}`で解除

## インポートパスのルール

コンポーネントのインポートは以下のようにすること
特にSerendie UIのコンポーネントは`@serendie/ui`からインポートすること。
また、あらかじめ`use client`が適用されたコンポーネントを `@serendie/ui/client` からインポートして使うこともできます

```tsx
// @serendie/uiが提供する機能コンポーネント
import { TextField, PasswordField, Button, ... } from "@serendie/ui";
// PandaCSSが提供するスタイルユーティリティ
import { css } from "@serendie/ui/css";
// PandaCSSが提供するレイアウトコンポーネント
import { Box, Center, Flex, Stack, VStack, ... } from "@serendie/ui/jsx";
```
