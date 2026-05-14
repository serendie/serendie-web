# Serendie MCP Server

## 位置付け

- **利用者**: Serendie を使う開発者が Claude Code / Codex / Cursor 等から MCP 経由でアクセスする**公開リモート MCP**。エンドポイント: `https://serendie.design/mcp`
- **ホスト方式**: ドキュメントサイト本体は静的サイト (`astro.config.mjs` の `output: "static"`) だが、`src/pages/mcp/[...path].ts` だけ `prerender = false` で **Cloudflare Workers にて動的にホスト**される。`@hono/mcp` の `StreamableHTTPTransport` 経由
- **核**: Serendie アセット (UI / デザイントークン / シンボル) の一覧・詳細取得と、ガイドライン検索 (`search-serendie-guideline` = Cloudflare AutoRAG 経由)

## `get-serendie-ui-overview` の扱い

- 本ツールは **Agent Skill 非対応クライアント向けのフォールバック。** Serendie 関連の前提知識提供の主経路は `serendie:serendie-overview` Skill (serendie/serendieリポジトリで管理) で、Skill が有効なら本ツールは呼ばれない

## テスト

- `npm run test:mcp` で MCP の統合テストを実行。**実エンドポイントへリクエストするため、先に `npm run dev` 起動が必要**
- ツール追加・変更後は必ず通すこと
- design-tokens のテストは `@serendie/design-token` の実データを使う (モック不使用)

## ツール追加の手順

1. `tools/` に新ファイルを作成 (既存ツールをパターンとして参照)
2. `server.ts` でインポート＆登録
3. `__tests__/tools/` にテストを追加
4. `test-client.ts` にテストケースを追加 (`test:mcp` の対象になる)

## 自動生成ファイル

- `data/components-manifest.json` は自動生成。**手動編集禁止**。`@serendie/ui` のパッケージ更新やコンポーネント MDX 変更後に `npm run build:componentsManifest` で再生成
