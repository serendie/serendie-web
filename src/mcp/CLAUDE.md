# Serendie MCP Server

Serendie Design Systemが提供するガイドラインやアセットを提供するMCPサーバー
次のようなツールを提供する。

- Serendie UI (@serendie/ui), デザイントークン (@serendie/design-token), Serendie Symbols (@serendie/symbols) のアセットの一覧と詳細
- 本リポジトリに含まれるガイドラインの検索

## コマンド

```bash
npm run test:mcp
npm test src/mcp
```

## 開発ルール

- ツール追加・変更後は必ず `npm run test:mcp` を実行して動作確認する
- `test:mcp` は開発サーバーへ実際にリクエストするため、先に `npm run dev` が必要
- design-tokensのテストは `@serendie/design-token` の実データを使う（モック不使用）

## ツール追加の手順

1. `tools/` に新ファイルを作成（既存ツールをパターンとして参照）
2. `server.ts` でインポート＆登録
3. `__tests__/tools/` にテストを追加
4. `test-client.ts` にテストケースを追加

## アーキテクチャ上の注意点

- MCPエンドポイント: `/mcp`（Streamable HTTP transport）
- `data/components-manifest.json` は自動生成ファイル — 手動編集しない。`@serendie/ui` のパッケージ更新やMDXドキュメント変更後に `npm run build:componentsManifest` で再生成する
- `schemas/serendie-ui-overview.md` は `get-serendie-ui-overview` ツールが返すMarkdownコンテンツ。AIアシスタントが最初に呼ぶべきツールで、デザインシステムの前提知識を提供する
- `search-serendie-guideline` は Cloudflare AutoRAG APIを使用。環境変数 `CF_ACCOUNT_ID`, `CF_API_TOKEN`, `DOCUMENT_SEARCH_INDEX` が必要
- `ui/` 配下は OpenAI Apps SDK連携用のプレビューウィジェット
