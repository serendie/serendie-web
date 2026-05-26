---
name: serendie-web-component-doc
description: >-
  Serendie Web（@serendie/ui デザインシステムのドキュメントサイト）リポジトリに、新しいコンポーネントの
  ドキュメントページを追加するためのワークフロー。MDX ドキュメント・サンプルコード・i18n 翻訳の作成と、
  サンプルコードの「観点」別の切り分け方、Storybook リンクの貼り方を定義する。ユーザーが
  「コンポーネントページを追加したい」「コンポーネントをドキュメント化したい」「sampleCode を追加したい」
  「src/content/components 配下に MDX を作りたい」と言ったとき、あるいは Serendie の特定コンポーネント名を挙げて
  ドキュメント整備を依頼したときは、明示的に「スキルを使って」と言われなくても必ずこのスキルを参照すること。
  ファイル設置だけで URL が自動生成される構成なので、手順を外すと壊れやすい点に注意。
---

# Serendie Web コンポーネントドキュメント追加

## このスキルがやること

Serendie Web のリポジトリ内で作業するエージェント向けに、新しいコンポーネントのドキュメントページを
追加する一連の流れをガイドする。ルーティングは `src/pages/components/[...slug].astro` が
コンテンツコレクションから自動生成するため、**正しい場所にファイルを置くだけで URL が生える**。
逆に言うと、置き場所・命名・frontmatter スキーマを外すと表示されない／ビルドが壊れるので、手順に忠実に進めること。

作業の単位は「1 コンポーネント = MDX 1 枚 + サンプルコード複数 + 翻訳エントリ複数」。

## 作業前の確認

着手する前に、必ず既存の実装を 1 つ読んで「現在の正解」に合わせること。ドキュメントは更新されるが、
リポジトリの実体が最終的な真実。特に次を確認する:

- frontmatter スキーマ: `src/content/config.ts`（コンテンツコレクションの定義。必須フィールドはここを見る）
- サンプルコードの書き方の手本: `src/sampleCode/Button/`（`SizeSample.tsx`, `TypeSample.tsx` など）
- 複雑なコンポーネントの手本: `src/sampleCode/DataTable/`（`BasicSample.tsx` / `AdvancedSample.tsx` / 機能別）
- 翻訳の入れ方: `src/i18n/ui-components.ts`（`ja` / `en` の既存エントリ）
- MDX の書き方の手本: `src/content/components/button.mdx`

行番号は変わりやすいので、パスを頼りにファイル内を grep / 目視で確認する。スキーマやライブラリの
prop が手本と食い違っていたら、**手本側を正**として進めること。

---

## 手順

### 1. MDX ドキュメントを作成

`src/content/components/<component-name>.mdx` を作成する。スラッグはファイル名がそのままパスになる
（例: `new-component.mdx` → `/components/new-component/`）。ケバブケースで付ける。

frontmatter は `src/content/config.ts` のスキーマに従う。雛形は `assets/component-template.mdx` を参照
（コピーして書き換えるのが速い）。最低限の形は次のとおり:

```mdx
---
title: NewComponent
componentName: 新しいコンポーネント
description: コンポーネントの説明文。
descriptionEn: "English description."
lastUpdated: "2026-05-13"
---

import CodeI18n from "@/components/CodeI18n.astro";
import { BasicSample } from "@/sampleCode/NewComponent/BasicSample";
import basicSampleRaw from "@/sampleCode/NewComponent/BasicSample.tsx?raw";

<CodeI18n
  titleKey="components.newComponent.basic.title"
  descriptionKey="components.newComponent.basic.desc"
  code={basicSampleRaw}
  storyPath="/story/components-newcomponent--basic"
>
  <BasicSample client:load />
</CodeI18n>
```

要点:

- `?raw` インポートでソースが `Code` ブロックにそのまま表示される。コンポーネント本体（`<BasicSample />`）と
  生ソース（`basicSampleRaw`）の両方を import すること。
- `CodeI18n` は 1 ブロック = 1 サンプルの粒度で使う。観点を増やすぶんだけブロックを並べる
  （手本: `src/content/components/button.mdx`）。
- `titleKey` / `descriptionKey` は手順 3 で `ui-components.ts` に登録するキーと一致させる。
- `storyPath` は手順の最後で貼る Storybook リンク。形式は既存の MDX に合わせる。

### 2. サンプルコードを作成

`src/sampleCode/<ComponentName>/` に React コンポーネントを置く。**実際の `@serendie/ui` ライブラリの
コンポーネントを使う**こと（モックや自作の代用品で済ませない）。手本は `src/sampleCode/Button/`。

切り分け方・命名・コードの書き方は後半の「サンプルコードの切り分け方」に従う。ここが品質の肝。

### 3. 翻訳文章を追加

`src/i18n/ui-components.ts` の `ja` / `en` **両方**に、MDX で参照した `titleKey` / `descriptionKey` を追加する
（手本: 既存の `components.*` エントリ）。ここに各サンプルの説明文を書き、MDX 側はキー参照だけで流し込む形にする。

`ja` だけ／`en` だけにならないよう、両言語そろえること。片方欠けると表示崩れや未翻訳キーの露出につながる。

### 4. 確認

- `npm run dev` で `http://localhost:<port>/components/<component-name>/` を開いて表示確認。
- ナビゲーション一覧は手動登録不要。コンテンツ一覧から自動で拾われるので、サイドナビに出ているかも確認する。
- `npm run lint` を通す。
- MCP に影響する変更なら `npm run test:mcp` も実行する。

---

## サンプルコードの切り分け方

ここが「読まれるドキュメント」になるかを左右する部分。Figma のコンポーネント表（バリエーションのマトリックス）に
対応させて、観点ごとにサンプルを分けるのが基本方針。

### 命名規則

- ディレクトリ: コンポーネント名と一致する **PascalCase**（例: `Button/`, `CheckBox/`, `DataTable/`）
- ファイル名: `<観点>Sample.tsx` の PascalCase（例: `SizeSample.tsx`, `TypeSample.tsx`）
- export 名: ファイル名と同じ **named export**（`?raw` でそのまま画面表示されるため、default export にしない）

### 観点のパターン

既存コンポーネントから抽出できる典型的な切り口。Figma のマトリックスを見て、そのコンポーネントに
当てはまるものを選ぶ:

| 観点 | ファイル名の例 | 用途 |
| --- | --- | --- |
| サイズ | `SizeSample.tsx` | `size` prop の選択肢を並べる（Button, Badge） |
| バリエーション / 種類 | `TypeSample.tsx` | `styleType`, `variant` などの違いを並べる |
| 色 | `ColorSample.tsx` | カラーバリエーション（Badge） |
| アイコン | `IconSample.tsx` | アイコン付き表示パターン |
| 状態 | `StateSample.tsx` | Enabled / Hover / Focus / Disabled / Loading など |
| 基本 / 応用 | `BasicSample.tsx` / `AdvancedSample.tsx` | 段階的な複雑性（DataTable） |
| 機能別 | `SortingSample.tsx`, `SelectionSample.tsx` | 個別機能の解説（DataTable） |

### 観点の最小セット（どこまで作るか）

機械的に全観点を作るのではなく、**コンポーネントに応じて判断する**。基準は次のとおり:

- **`BasicSample`（基本形）は常に必須。** 最小で動く形を最初に見せる。これだけは全コンポーネントで作る。
- それ以外の観点は、**Figma のコンポーネント表（マトリックス）と、実際のコンポーネントの props を突き合わせて、
  該当するものを選ぶ。** 例:
  - `size` prop がある → `SizeSample`
  - `styleType` / `variant` がある → `TypeSample`
  - `disabled` などの状態を持つインタラクティブ要素 → `StateSample`
  - 色バリエーション・アイコン対応・複合機能があれば、それぞれ `ColorSample` / `IconSample` / 機能別を足す
- 該当しない観点のサンプルは**作らない**（空のサイズ違いを並べても情報量がない）。逆に Figma にあるのに
  抜けている観点がないかは必ず確認する。
- 迷ったら手本（Button = Size + Type、DataTable = Basic + Advanced + 機能別）の粒度感に寄せる。

### 「読まれるコード」の原則

`?raw` でソースがそのまま表示される前提なので、サンプルは「コピペで動く読み物」として書く:

- 過度な抽象化を避け、**コピペでそのまま動くコード**にする。
- **1 ファイルで完結**させる（外部の小コンポーネントへの分割は避ける）。読み手が 1 画面で理解できることを優先。
- **型注釈は明示的に**書く（手本の `DataTable/BasicSample.tsx` のように、必要なら `export type` を併記）。
- import 文の順序・整形を揃える（ESLint / Prettier に従う）。最後に `npm run lint` で確認。

### Storybook リンク

各サンプルには対応する Storybook の story へのリンクを貼る。

- story は `serendie/serendie` リポジトリ側にあるので、そちらをチェックして対応する story を見つける。
- MDX の `CodeI18n` の `storyPath` に、対応する story のパスを渡す（手本の MDX のパス形式に合わせる）。
- サンプル（観点）ごとに、対応する story にそれぞれ貼る。
- `CodeI18n` は `Code.astro` に `storyPath` を渡して Storybook リンクを表示する仕組み
  （`src/components/CodeI18n.astro` を参照）。

---

## チェックリスト（完了前に確認）

- [ ] `src/content/components/<component-name>.mdx` を作成し、frontmatter がスキーマに沿っている
- [ ] サンプルは `@serendie/ui` の実コンポーネントを使い、PascalCase ディレクトリ + `<観点>Sample.tsx` + named export
- [ ] `BasicSample` がある。それ以外は Figma マトリックス × props で必要な観点だけ作った
- [ ] 各サンプルが 1 ファイル完結・コピペで動く・型注釈あり・lint 通過
- [ ] `ui-components.ts` の `ja` / `en` 両方に `titleKey` / `descriptionKey` を追加した
- [ ] `storyPath` を `serendie/serendie` の対応 story に合わせて貼った
- [ ] `npm run dev` で該当 URL を開いて表示確認。サイドナビにも出ている
- [ ] `npm run lint`（必要なら `npm run test:mcp`）が通る
