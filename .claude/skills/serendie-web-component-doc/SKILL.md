---
name: serendie-web-component-doc
description: >-
  Serendie Web リポジトリに、新しいコンポーネントのドキュメントページ
  （MDX・サンプルコード・i18n 翻訳）を追加するワークフロー。「コンポーネントを
  ドキュメント化したい」「sampleCode を追加したい」「src/content/components 配下に
  MDX を作りたい」と言われたとき、または Serendie の特定コンポーネント名を挙げて
  ドキュメント整備を依頼されたときに使う。
metadata:
  internal: true
---

# Serendie Web コンポーネントドキュメント追加

新しいコンポーネントのドキュメントページを追加するワークフロー。
ルーティングは `src/pages/components/[...slug].astro` がコンテンツコレクションから自動生成するため、
**正しい場所にファイルを置くだけで URL が生える**。逆に置き場所・命名・frontmatter スキーマを外すと
表示されない／ビルドが壊れるので、手順に忠実に進めること。

作業の単位は「1 コンポーネント = MDX 1 枚 + サンプルコード複数 + 翻訳エントリ複数」。
**1 セッションにつき 1 コンポーネント**。

---

## 1. 対象を決める

1. `@serendie/ui` などの主要パッケージを最新化する。新規コンポーネントが追加されている可能性があるため、
   このステップを先に済ませてから対象を選ぶこと（package.json の更新なので、進める前に一声かける）。
2. ユーザーから対象コンポーネントの指示があればそれに従う。
3. 指示がなければ、ドキュメント未作成のコンポーネントを一覧してユーザーに確認する。
   意図的に未作成のコンポーネントもあるため、勝手に着手しない。

対象が決まったら、着手前に**既存の手本を 1 つ読む**こと。リポジトリの実体が最終的な真実なので、
ここで「現在の正解」を掴んでから設計に入る。

- シンプルな手本: `src/content/components/button.mdx` + `src/sampleCode/Button/`
- 複雑な手本: `src/sampleCode/DataTable/`（Basic / Advanced / 機能別の切り分け）
- frontmatter スキーマ: `src/content/config.ts`
- 翻訳の入れ方: `src/i18n/ui-components.ts`

スキーマや手本の書き方が、このスキルの記述と食い違っていたら**手本側を正**とする。

---

## 2. サンプル設計を決める

ここがドキュメントの読みやすさを決める一番大事なステップ。Figma のコンポーネント表
（バリエーションのマトリックス）に対応させて、観点ごとにサンプルを分けるのが基本方針。
観点が決まらないと MDX のブロック数も決まらないので、**実装より先にここを固める**。

### 観点パターン

| 観点                  | ファイル名の例                             | 用途                                              |
| --------------------- | ------------------------------------------ | ------------------------------------------------- |
| 基本 / 応用           | `BasicSample.tsx` / `AdvancedSample.tsx`   | 段階的な複雑性（DataTable）                       |
| サイズ                | `SizeSample.tsx`                           | `size` prop の選択肢を並べる（Button, Badge）     |
| バリエーション / 種類 | `TypeSample.tsx`                           | `styleType`, `variant` などの違いを並べる         |
| 色                    | `ColorSample.tsx`                          | カラーバリエーション（Badge）                     |
| アイコン              | `IconSample.tsx`                           | アイコン付き表示パターン                          |
| 状態                  | `StateSample.tsx`                          | Enabled / Hover / Focus / Disabled / Loading など |
| 機能別                | `SortingSample.tsx`, `SelectionSample.tsx` | 個別機能の解説（DataTable）                       |

### どこまで作るか

機械的に全観点を網羅しない。コンポーネントに応じて選ぶ。

- **`BasicSample` だけは必須**。最小で動く形を最初に見せる。
- それ以外は **Figma のマトリックスと、実コンポーネントの props を突き合わせて、該当するものだけ**作る。
  - `size` prop がある → `SizeSample`
  - `styleType` / `variant` がある → `TypeSample`
  - `disabled` などインタラクティブな状態 → `StateSample`
  - 色・アイコン・複合機能があれば、それぞれ追加
- 該当しない観点のサンプルは作らない（空の Size 比較を並べても情報量がない）。
- 迷ったら手本の粒度感に寄せる（Button = Size + Type、DataTable = Basic + Advanced + 機能別）。

観点の最終的な粒度はユーザーが Figma を見ながら判断する領域。
**こちらからパターンを提示し、ユーザーに決めてもらう**こと。

---

## 3. 実装する

### 3-1. サンプルコード

`src/sampleCode/<ComponentName>/` 配下に React コンポーネントを置く。
手本は `src/sampleCode/Button/`。

**命名規則**

- ディレクトリ: コンポーネント名と一致する PascalCase（`Button/`, `CheckBox/`, `DataTable/`）
- ファイル名: `<観点>Sample.tsx`（`SizeSample.tsx`, `TypeSample.tsx`）
- export: ファイル名と同じ **named export**（`?raw` でそのまま画面表示されるため default export にしない）

**「読まれるコード」として書く**

`?raw` でソースがそのまま MDX 内の Code ブロックに表示される前提なので、サンプルは
「コピペで動く読み物」として書く。

- 実際の `@serendie/ui` のコンポーネントを使う（モックや自作の代用品で済ませない）
- **1 ファイルで完結**させる（外部の小コンポーネントへの分割は避ける、1 画面で理解できる粒度）
- 過度な抽象化を避け、コピペでそのまま動くコードにする
- 型注釈は明示的に書く（必要なら `export type` を併記。手本: `DataTable/BasicSample.tsx`）
- import 順や整形は ESLint / Prettier に従う

### 3-2. MDX ドキュメント

`src/content/components/<component-name>.mdx` を作成する。
**ファイル名のケバブケースがそのまま URL のスラッグになる**（例: `new-component.mdx` → `/components/new-component/`）。

frontmatter は `src/content/config.ts` のスキーマに従う。雛形:

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

**ポイント**

- 観点を増やすときは、import 2 行（コンポーネント本体 + `?raw` ソース）と `CodeI18n` ブロックをセットで複製する。
- `?raw` インポートにより、サンプルのソースがそのまま Code ブロックに表示される。
  本体と生ソースの**両方を import** すること。
- `titleKey` / `descriptionKey` は次のステップで `ui-components.ts` に登録するキーと一致させる。
- `storyPath` は `serendie/serendie` リポジトリ側にある対応 story のパス。
  既存 MDX のパス形式に合わせる（仕組み: `src/components/CodeI18n.astro` が `Code.astro` に渡してリンク表示）。

### 3-3. 翻訳

`src/i18n/ui-components.ts` の `ja` / `en` **両方**に、MDX で参照した `titleKey` / `descriptionKey` を追加する。
片方欠けると未翻訳キーが露出するので必ず揃える。

**説明文のライティング指針**

- 各サンプルの説明文は**ユーザーが既に案を持っていることが多い**。こちらから例示しつつ問いかける。
- 例示する際は次を意識する:
  - **簡潔に**。2 行程度に収め、不要に情報を盛らない（AI Slop を避ける）。
  - **使う側のベネフィットや注意点**を中心に書く。
  - 書くべき情報が無いときは無理せず短くまとめる。`less is more`。

良い例:

> ラベルの左右にアイコンを入れることができます。ボタンがトリガーするアクションを視覚的にユーザーに伝えることができます。

> Small と Medium の 2 種類があります。Small は PC など大きな画面でマウス操作する前提で、モバイルなどタッチデバイスでは非推奨です。Medium は画面サイズにかかわらず使用できます。

情報が薄いとき:

> Small と Medium の 2 種類があります。

---

## 4. 確認する

- `npm run dev` で `http://localhost:<port>/components/<component-name>/` を開いて表示確認。
- サイドナビにも自動で出ているか確認（コンテンツ一覧から自動取得されるため手動登録は不要）。
- `npm run lint` を通す。
- MCP に影響する変更なら `npm run test:mcp` も実行（先に `npm run dev` が起動している必要あり）。

---

## チェックリスト

- [ ] `@serendie/ui` などのパッケージを最新化した
- [ ] 観点を Figma マトリックス × props で絞り込み、ユーザーと合意した（`BasicSample` は必須）
- [ ] サンプルは `@serendie/ui` の実コンポーネントを使い、PascalCase ディレクトリ + `<観点>Sample.tsx` + named export
- [ ] 各サンプルが 1 ファイル完結・コピペで動く・型注釈あり
- [ ] `src/content/components/<component-name>.mdx` を作成し、frontmatter がスキーマに沿っている
- [ ] `ui-components.ts` の `ja` / `en` 両方に `titleKey` / `descriptionKey` を追加した
- [ ] `storyPath` を `serendie/serendie` の対応 story に合わせて貼った
- [ ] `npm run dev` で URL を開いて表示確認。サイドナビにも出ている
- [ ] `npm run lint`（必要なら `npm run test:mcp`）が通る
