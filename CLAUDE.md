# CLAUDE.md

## プロジェクト概要

Serendie Web は三菱電機のオープンデザインシステム「Serendie Design System (SDS)」の公式ドキュメントサイト。Astro + React + TypeScript + PandaCSS で構築されている。

- 本番: https://serendie.design/
- ステージング: https://dev.serendie-web.pages.dev/
- Storybook: https://storybook.serendie.design/ (別リポジトリ)

**位置付け**: 本リポジトリは**ドキュメントサイト**であって、コンポーネント本体 (`@serendie/ui`)・アイコン (`@serendie/symbols`)・デザイントークン (`@serendie/design-token`) の実装は別リポジトリ。本リポジトリでは、一般ユーザーと同様に、各パッケージは公開済みのものを参照する

## デプロイ

- `main` branch: 本番 (serendie.design)
- `dev` branch: ステージング (dev.serendie-web.pages.dev)

## i18n / 翻訳ワークフロー

日本語と英語の2系統を**別経路**で管理する。混同しないこと。

### MDX コンテンツの翻訳

- **日本語ファースト**: 原稿は `src/content/pages/` 配下に書く
- 英訳は `src/content/pages/en/` 配下に**同じファイル構成でミラー配置**する
- 日本語側を変更したら英訳側の同期も忘れない (コミット例: `docs: Sync English translations with recent Japanese updates`)

### UI 文字列の翻訳

- `src/i18n/ui.ts` がローカル辞書、**Figma Variables が源泉** であり、コマンドで同期する
- 同期コマンド:
  - `npm run translations:pull` — Figma → `ui.ts`
  - `npm run translations:push` — `ui.ts` → Figma
  - `npm run translations:lint` — 言語間のキー漏れ・未翻訳検査 (PR では必須)
- `"#"` は **未翻訳の placeholder** (Figma が空文字を送れない制約の回避)。lint で弾かれる
- 詳細は `scripts/translations/README.md` 参照

## ビルドの再生成タイミング

以下を変更したら対応するコマンドを叩いて生成物を更新する:

| 変更対象                                                         | 必須コマンド                       |
| ---------------------------------------------------------------- | ---------------------------------- |
| `panda.config.ts` / Panda の style 設定                          | `npm run build:panda`              |
| `tokens/data/` 配下のデザイントークン                            | `npm run build:tokens`             |
| `@serendie/ui` のバージョンアップ、コンポーネント MDX の大幅変更 | `npm run build:componentsManifest` |

`npm run dev` 起動時に `build:panda` と `build:componentsManifest` は自動実行される。ただし**起動中に上記を変更した場合は手動再実行が必要**。

## テスト

2系統が共存:

- **`npm run test`** (vitest) — 一般コードのユニットテスト
- **`npm run test:mcp`** — MCP サーバーの統合テスト。実エンドポイントを叩くため**先に `npm run dev` を起動しておくこと**
- MCP 関連の詳細ルールは `src/mcp/CLAUDE.md` 参照
