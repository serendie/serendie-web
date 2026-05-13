# SDS Web

- Serendie Design System ドキュメントサイト (serendie.design)
- Serendie MCPサーバー (serendie.design/mcp)

## Staging

URL: https://dev.serendie-web.pages.dev/

`dev` ブランチに push すると、ステージング環境へデプロイされます。

## Production

URL: https://serendie.design/

`main` ブランチに push すると、プロダクション環境へデプロイされます。

### Test

```bash
npm run test
npm run test:mcp   # MCP サーバーの統合テスト (`npm run dev`の起動が必要)
```

## Serendie MCP

`@hono/mcp` でCloudflare Workersにホストしています。
`npm run dev` で MCP エンドポイントもローカル起動します。ツール追加・変更後は `npm run test:mcp` で動作確認してください。

## i18n

いずれも英訳はLLMで実施

1. ガイドラインドキュメント(MDX)は日本語ファースト記述し、英訳を `src/content/pages/en/` 配下に同じファイル構成でミラー配置しています。
2. サイト内のUIテキスト (ボタンラベル等)は `src/i18n/ui.ts` にてKey/Value形式で管理します。

## Others

- storybook ( https://storybook.serendie.design/ ) は [serendie/serendie](https://github.com/serendie/serendie) で管理しています。
