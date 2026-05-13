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

日本語でライティングを行い、英訳はLLMで実施するワークフロー

1. ガイドラインドキュメント(MDX)は、日本語に対応する英訳ファイルを `src/content/pages/en/` 配下にミラー配置
2. サイト内のUIテキスト (ボタンラベル等)は `src/i18n/ui.ts` および `src/i18n/ui-components.ts` にてKey/Value形式で管理

## Others

- storybook ( https://storybook.serendie.design/ ) は [serendie/serendie](https://github.com/serendie/serendie) で管理しています。
