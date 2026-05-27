---
name: serendie-web-component-doc
description: >-
  Serendie Web リポジトリに、新しいコンポーネントのドキュメントページ（MDX・サンプルコード・i18n 翻訳）を追加するワークフロー。
  「コンポーネントをドキュメント化したい」「src/content/components 配下にMDX を作りたい」と言われたとき、
  またはSerendie UIの特定コンポーネント名を挙げてドキュメント整備を依頼されたときに使う。
metadata:
  internal: true
---

# Serendie Web コンポーネントドキュメントの追加

このSkillは、新しいコンポーネントのドキュメントページを追加するワークフローである。
Serendie Webは、Astroベースであり、ルーティングは `src/pages/components/[...slug].astro` がコンテンツコレクションから自動生成するため、正しい場所にファイルを置くだけでURLが生える。
逆に置き場所・命名・frontmatter スキーマを外すと表示されない／ビルドが壊れるので、**手順に忠実に進めること。**

作業の単位は「1 コンポーネント = MDX 1 枚 + サンプルコード複数 + 翻訳エントリ複数」から構成される。ユーザーから指示がない限り、作業対象は、**1 セッションにつき 1 コンポーネント**を原則とする。

---

## 1. 対象を決める

1. `@serendie/ui` などの主要パッケージを最新化する。新規コンポーネントが追加されている可能性があるため、
   このステップを先に済ませてから対象を選ぶこと（@serendie/uiパッケージの更新はユーザーに一報した上で、確認をとらずに実行して良い）。
2. ユーザーから対象コンポーネントの指示があればそれに従う。
3. 指示がなければ、ドキュメント未作成のコンポーネントを一覧してユーザーに確認する。
   意図的に未作成のコンポーネントもあるため、勝手に着手しない。

## 2. インプットを揃える

対象が決まったら、設計に入る前にドキュメント側とコンポーネント実装側の両方から「現在の正解」を掴む。
リポジトリの実体が最終的な真実なので、スキーマや手本がこのスキルの記述と食い違っていたら**実装および手本側を正**とする。

### ドキュメント側 (手本)

着手前に**既存の手本を 1 つ読む**こと。

- シンプルな手本: `src/content/components/button.mdx` + `src/sampleCode/Button/`
- 複雑な手本: `src/sampleCode/DataTable/`（Basic / Advanced / 機能別の切り分け）
- frontmatter スキーマ: `src/content/config.ts`
- 翻訳の入れ方: `src/i18n/ui-components.ts`

### コンポーネント実装側 (Props)

- 対象となるコンポーネント実装について、`@serendie/ui` を実際に読むこと。
- コンポーネントが持つ Props は次工程のサンプル設計に直結する重要なインプットである
- どんな機能性をそのコンポーネントが提供しているのか把握するため、**型情報だけでなく実体のコンポーネント実装も見ること。**

---

## 3. サンプル設計を決める

コンポーネントドキュメントは、複数のサンプルセクションから構成される。どのような観点でサンプルを設けるのかが、ドキュメントの品質を決める一番大事なステップ。
全てを推測に基づいて作成するのではなく、**適宜ユーザーと協議しながら進めること。**

Figmaコンポーネントが持つプロパティに対応させて、観点ごとにサンプルを分けるのが基本方針。
ユーザーはFigmaコンポーネントを見ながら観点設計を行い、あなたはReactコンポーネントのPropsを見ながら観点設計を行う。

観点が決まらないと MDX のブロック数も決まらないので、実装より先にここを固める。

### 観点パターン

代表的なサンプル設計パターンは下記である。

| 観点                  | ファイル名の例                             | 用途                                              |
| --------------------- | ------------------------------------------ | ------------------------------------------------- |
| サイズ                | `SizeSample.tsx`                           | `size` prop の選択肢を並べる（Button, Badge）     |
| バリエーション / 種類 | `TypeSample.tsx`                           | `styleType`, `variant` などの違いを並べる         |
| 色                    | `ColorSample.tsx`                          | カラーバリエーション（Badge）                     |
| 状態                  | `StateSample.tsx`                          | Enabled / Hover / Focus / Disabled / Loading など |
| アイコン              | `IconSample.tsx`                           | アイコン付き表示パターン                          |
| 機能別                | `SortingSample.tsx`, `SelectionSample.tsx` | 個別機能の解説（DataTable）                       |
| 基本 / 応用           | `BasicSample.tsx` / `AdvancedSample.tsx`   | 段階的な複雑性（DataTable）                       |

### 判断軸

機械的に全観点を網羅しない。less is moreを大切にする。
観点の最終的な粒度はユーザーが Figma を見ながら判断する。**こちらからパターンを提示し、ユーザーに決めてもらう**こと。

- 原則はFigma/Reactのプロパティをベースに該当するものだけ作る
  - `size` prop がある → `SizeSample`
  - `styleType` / `variant` がある → `TypeSample`
  - `disabled` などインタラクティブな状態がある → `StateSample`
  - 機能による違いがあれば、それぞれ追加
- 該当しない観点のサンプルは作らない（空の Size 比較を並べても情報量がない）。
- DataTable や DatePicker など、機能性を持つ Molecules 相当の複雑なコンポーネントは、まずは基本的な使い方 (`BasicSample`) を示す。逆に Button など Atom 相当のシンプルなコンポーネントでは不要。
- 迷ったら手本の粒度感に寄せる（Button = Size + Type / DataTable = Basic + Advanced + 機能別）。

### StateMatrix の使い方

状態 (StateSample) を見せるための専用ユーティリティとして、リポジトリ内に `StateMatrix` がある（`src/components/StateMatrix.tsx`、`@/components/StateMatrix` でimport可能）。
手本: `src/sampleCode/Button/StateSample.tsx`。

- 2軸のマトリクス表示は情報密度が高い反面複雑なので、必要な時のみ使う。
- **既に他観点で採用されているものは、マトリクスの軸として使わないこと**（`SizeSample` があれば、`StateMatrix` の軸に Size は使わない）。観点同士の役割を被らせない。

## 4. 実装する

### 4-1. サンプルコード

`src/sampleCode/<ComponentName>/` 配下に React コンポーネントを置く。手本は `src/sampleCode/Button/`。

**命名規則**

- ディレクトリ: コンポーネント名と一致する PascalCase（`Button/`, `CheckBox/`, `DataTable/`）
- ファイル名: `<観点>Sample.tsx`（`SizeSample.tsx`, `TypeSample.tsx`）
- export: ファイル名と同じ **named export**（`?raw` でそのまま画面表示されるため default export にしない）

**「読まれるコード」として書く**

`?raw` でソースがそのまま MDX 内の Code ブロックに表示される前提なので、サンプルは「コピペで動く読み物」として書く。

- 実際の `@serendie/ui` のコンポーネントを使う（モックや自作の代用品で済ませない）
- **1 ファイルで完結**させる（外部の小コンポーネントへの分割は避ける、1 画面で理解できる粒度）
- **過度な抽象化を避け、シンプルさが重要**。コピペでそのまま動くコードにする
- 型注釈は明示的に書く（必要なら `export type` を併記。手本: `DataTable/BasicSample.tsx`）
- import 順や整形は ESLint / Prettier に従う

### 4-2. MDX ドキュメント

`src/content/components/<component-name>.mdx` を作成する。
**ファイル名のケバブケースがそのまま URL のスラッグになる**（例: `new-component.mdx` → `/components/new-component/`）。
frontmatter は `src/content/config.ts` のスキーマに従う。

下記が最小の雛形:

```mdx
---
title: NewComponent
componentName: 新しいコンポーネント
description: コンポーネントの説明文。
descriptionEn: "English description."
lastUpdated: "2026-05-13"
---

import CodeI18n from "@/components/CodeI18n.astro";
import { SizeSample } from "@/sampleCode/NewComponent/SizeSample";
import sizeSampleRaw from "@/sampleCode/NewComponent/SizeSample.tsx?raw";

<CodeI18n
  titleKey="components.newComponent.size.title"
  descriptionKey="components.newComponent.size.desc"
  code={sizeSampleRaw}
  storyPath="/story/components-newcomponent--size"
>
  <SizeSample client:load />
</CodeI18n>
```

**ポイント**

- 観点を増やすときは、import 2 行（コンポーネント本体 + `?raw` ソース）と `CodeI18n` ブロックをセットで複製する。観点ごとに `titleKey` / `descriptionKey` のサブキー（`size.title`, `size.desc` など）を揃える。
- `?raw` インポートにより、サンプルのソースがそのまま Code ブロックに表示される。本体と生ソースの**両方を import** すること。
- `titleKey` / `descriptionKey` は次のステップで `ui-components.ts` に登録するキーと一致させる。
- `storyPath` は `serendie/serendie` リポジトリ側にある対応 story のパス。
  既存 MDX のパス形式に合わせる（仕組み: `src/components/CodeI18n.astro` が `Code.astro` に渡してリンク表示）。

### 4-3. 説明文のライティング

大きく2種類(frontmatterのdescriptionおよび、各サンプルのdescription)の説明文を記述する。
Serendie UIユーザー向けドキュメントの根幹であり、ドキュメントの品質を決定づける。

**共通のライティング指針**

- Serendie UIユーザー向けに、このコンポーネントの利用方法を説明するものであり、日本語ファーストで記述する。
- **less is moreを最も重要にする**。AI Slopを避け、不要に情報を盛らない
- 各説明文は**ユーザーが既に案を持っていることが多い。** 下記の指針に従って素案を考え、それを例示しつつ問いかけることを基本スタンスとする
- **根拠ベースで書く**。コンポーネント実装 / 既存MDX / Figma / Storybook docs などから読み取れる事実だけを根拠とし、推測のベネフィットや使い分けガイドは書かない。手本の言い回しを借用するときも、それが当該コンポーネントにも当てはまる根拠を確認してから。
- 手本の文章量に合わせて埋めようとしない。まずは事実だけで書ける最短版を素案にし、情報を増やすかどうかはユーザーと協議する。
- **素案提示時は推測と事実を区別する**。根拠が薄い箇所には ⚠️ をつけて素案を出し、ユーザーが検証・差し戻しできるようにする。

**frontmatterの説明文**

→ MDX の frontmatter (`description` / `descriptionEn`) に直接書く。

- UIコンポーネントの役割や用途を端的に伝える
- Component Gallery (https://component.gallery/) から類似コンポーネントを探し、そのコンポーネントページの説明文を参考にする
- 文字数の目安は30~90文字。90文字に達することは稀である

良い例:

> アクションをトリガーするためのクリック可能なコンポーネントです。 (Button)
> オン/オフの2つの状態を切り替えるためのコンポーネントです。設定画面などでその状態を視覚的に伝えることができます。 (Switch)

**各サンプルの説明文**

→ `src/i18n/ui-components.ts` の `descriptionKey` 配下に書く（4-4 で日英両方に登録）。

- 手順3のサンプル設計に基づき、コンポーネントのバリエーションを解説する
  - 実装から確認できる事実（種類数、prop の効果など）を中心に書く。
  - ベネフィットや注意点、使い分けガイドも書くことが理想だが、Storybook docs / 既存ドキュメントなどに**外部根拠がある時だけ**書く。根拠がなければ書かない（手本にあるからといって真似しない）。
  - 書くべき情報が無いときは無理せず短くまとめる。「{X}と{Y}の2種類があります。」だけで十分なケースは多い。
- 文字数の目安は最大130文字。下限はなく短いほうが良い。

良い例:

> ラベルの左右にアイコンを入れることができます。ボタンがトリガーするアクションを視覚的にユーザーに伝えることができます。

> Small と Medium の 2 種類があります。Small は PC など大きな画面でマウス操作する前提で、モバイルなどタッチデバイスでは非推奨です。Medium は画面サイズにかかわらず使用できます。

書くべきことが無いときは下記でも良い:

> Small と Medium の 2 種類があります。

### 4-4. 翻訳

- i18n対応のため、Key/Value形式で文言を管理している。
- 対応言語は日英。手順4-3で記述した日本語を英訳すること（frontmatter description は MDX の `descriptionEn` に、各サンプル description は `ui-components.ts` の `en` ロケールに）。
- `src/i18n/ui-components.ts` の `ja` / `en` **両方**に、MDX で参照した `titleKey` / `descriptionKey` を追加する。片方欠けると未翻訳キーが露出するので必ず揃える。

---

## 5. 確認する

- `npm run dev` で `http://localhost:<port>/components/<component-name>/` を開いて表示確認。
- **サイドナビにも自動で出ているか確認**（コンテンツ一覧から自動取得されるため手動登録は原則不要）。
- `npm run lint` を通す。
- MCP に影響する変更なら `npm run test:mcp` も実行（先に `npm run dev` が起動している必要あり）。
