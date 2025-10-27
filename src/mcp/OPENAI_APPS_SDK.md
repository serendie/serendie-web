# OpenAI ChatGPT Apps SDK Integration

このドキュメントでは、Serendie MCP ServerのOpenAI ChatGPT Apps SDK統合について説明します。

## 概要

`get-component-detail` ツールがOpenAI Apps SDKに対応し、ChatGPT上でSerendieコンポーネントのライブプレビューを表示できるようになりました。

## アーキテクチャ

### 1. MCPリソース登録

**ファイル**: `src/mcp/server.ts`

HTMLテンプレートをMCPリソースとして登録:

```typescript
mcpServer.registerResource(
  "component-preview-widget",
  "ui://serendie/component-preview.html",
  {},
  async () => ({
    contents: [{
      uri: "ui://serendie/component-preview.html",
      mimeType: "text/html+skybridge",
      text: buildComponentPreviewTemplate(),
      _meta: {
        "openai/widgetPrefersBorder": true,
        "openai/widgetDescription": "Interactive preview of Serendie UI components...",
        "openai/widgetDomain": "https://serendie.design"
      }
    }]
  })
);
```

### 2. HTMLテンプレート

**ファイル**: `src/mcp/utils/html-builder.ts`

既存の `/preview/[component]` ページを読み込むHTML（`structuredContent`でコンポーネント名を受け取る）:

```html
<!DOCTYPE html>
<html>
<body>
  <iframe id="preview" src="about:blank"></iframe>
  <script>
    // OpenAI Apps SDKからstructuredContentを受け取る
    if (window.structuredContent && window.structuredContent.componentName) {
      iframe.src = `/preview/${window.structuredContent.componentName}`;
    }

    // またはpostMessageで受け取る
    window.addEventListener('message', (event) => {
      if (event.data && event.data.structuredContent) {
        const { componentName } = event.data.structuredContent;
        iframe.src = `/preview/${componentName}`;
      }
    });
  </script>
</body>
</html>
```

**重要**: `structuredContent`は最小限（コンポーネント名のみ）。詳細データは既存の`/preview`ページで管理。

### 3. ツール定義とレスポンス

**ファイル**: `src/mcp/tools/components.ts`

#### ツール定義（registerTool の第2引数）

```typescript
{
  title: "Get Component Detail",
  description: "...",
  _meta: {
    // HTMLテンプレートとの関連付け
    "openai/outputTemplate": "ui://serendie/component-preview.html",
    // ChatGPTに表示されるラベル
    "openai/toolInvocation/invoking": "Loading component preview...",
    "openai/toolInvocation/invoked": "Component preview loaded"
  },
  inputSchema: { ... }
}
```

#### ツールレスポンス

```typescript
return {
  content: [
    {
      type: "text",
      text: JSON.stringify(validatedResponse, null, 2)
    }
  ],
  // 最小限のstructuredContent（コンポーネント名のみ）
  structuredContent: {
    componentName: component.name,
    previewUrl: `/preview/${componentSlug}`
  },
  _meta: {
    componentSlug,
    documentationUrl,
    storybookUrls
  }
};
```

**設計のポイント**:
- ✅ `structuredContent`は最小限（コンポーネント名のみ）
- ✅ 詳細データは既存の `/preview/[component]` で管理
- ✅ データの2重管理を回避

## データフロー

```
ChatGPT User Query: "Buttonコンポーネントを見せて"
    ↓
ChatGPT calls get-component-detail("Button")
    ↓
MCP Server responds:
  - content: JSON data (for model)
  - structuredContent: { componentName: "Button" }
  - _meta: { ... }
    ↓
ChatGPT renders HTML widget (ui://serendie/component-preview.html)
    ↓
Widget receives structuredContent.componentName = "Button"
    ↓
Widget loads /preview/Button in iframe
    ↓
User sees interactive component preview!
```

**最適**: `structuredContent`は最小限。詳細データは既存の`/preview/[component]`で管理！

## OpenAI Apps SDK特有のフィールド

### _meta (ツール定義)

ツール定義に含める`_meta`（OpenAI Apps SDK用）:

```typescript
_meta: {
  "openai/outputTemplate": "ui://serendie/component-preview.html",
  "openai/toolInvocation/invoking": "Loading component preview...",
  "openai/toolInvocation/invoked": "Component preview loaded"
}
```

### _meta (ツールレスポンス)

レスポンスに含める`_meta`（UIコンポーネント専用メタデータ）:

```typescript
_meta: {
  componentSlug: "button",      // URLスラッグ
  documentationUrl: "...",      // ドキュメントURL
  storybookUrls: [...]          // Storybook URL配列
}
```

### structuredContent (ツールレスポンス)

UIコンポーネントにデータを渡すフィールド（最小限に保つ）:

```typescript
structuredContent: {
  componentName: "Button",      // コンポーネント名
  previewUrl: "/preview/button" // プレビューURL
}
```

### リソースの _meta

HTMLリソース自体のメタデータ:

- `openai/widgetPrefersBorder`: ウィジェットに境界線を表示
- `openai/widgetDescription`: ウィジェットの説明（モデル用）
- `openai/widgetDomain`: ウィジェットのドメイン

## 開発環境でのテスト

### 1. ローカル開発サーバー起動

```bash
npm run dev
```

### 2. MCP Inspectorでテスト

```bash
npm run test:mcp
```

以下を確認:
- リソース `ui://serendie/component-preview.html` が登録されているか
- `get-component-detail` レスポンスに `structuredContent` が含まれているか
- HTMLテンプレートが正しく生成されているか

### 3. ngrokでトンネリング（OpenAI接続用）

```bash
ngrok http 4321
```

生成されたHTTPS URLをOpenAI Apps設定に登録。

## 本番デプロイ

### 必要な設定

1. **HTTPS必須**: OpenAI Apps SDKはHTTPSエンドポイントが必要
2. **CORS設定**: Cloudflare Pagesで適切なCORS設定
3. **低レイテンシ**: コールドスタート時間を最小化

### Cloudflare Pages デプロイ

現在の設定で自動的にデプロイされます:

```
Production: https://serendie.design/mcp/
Staging: https://dev.serendie-web.pages.dev/mcp/
```

## 使用方法（ChatGPT側）

### 1. MCP Serverの登録

ChatGPT Apps設定で以下を登録:

```json
{
  "name": "Serendie Design System",
  "endpoint": "https://serendie.design/mcp/",
  "description": "Interactive preview of Serendie UI components"
}
```

### 2. ユーザーとのインタラクション

ユーザー:
> "Buttonコンポーネントの使い方を教えて"

ChatGPTの応答:
1. **テキスト**: コンポーネントの説明、Props、使用方法
2. **ライブプレビュー**: 実際に動作するButtonコンポーネント
   - タブで複数サンプルを切り替え
   - インタラクティブな動作確認

## トラブルシューティング

### プレビューが表示されない

- 開発サーバーが起動しているか確認
- ブラウザコンソールでエラーを確認
- `/preview/[component]` に直接アクセスして動作確認

### structuredContentが渡されない

- `structuredContent` フィールドが正しく設定されているか確認
- MCP Inspectorでレスポンスを確認

### HTMLテンプレートが読み込まれない

- リソースURIが正しいか確認: `ui://serendie/component-preview.html`
- MIME Typeが正しいか確認: `text/html+skybridge`
- リソースが登録されているか `npm run test:mcp` で確認

## 今後の拡張

- [ ] CSP設定の追加（外部リソース読み込み制御）
- [ ] ローディング状態の改善
- [ ] エラーハンドリングの強化
- [ ] コンポーネント内からのツール呼び出し（widgetAccessible）
- [ ] 複数サンプルのタブ切り替えUI改善

## 参考リンク

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk/build/mcp-server)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Serendie Design System](https://serendie.design/)
