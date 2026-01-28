# MCP Apps Integration

このドキュメントでは、Serendie MCP ServerのMCP Apps統合について説明します。

## 概要

`get-component-detail` ツールがMCP Apps対応し、Claude Desktop、VS Code、その他のMCP Appsをサポートするホスト上でSerendieコンポーネントのライブプレビューを表示できます。

## MCP Appsとは

MCP Apps は Model Context Protocol の拡張機能で、MCPサーバーがインタラクティブなHTML UIをホストに返すことを可能にします。テキスト応答だけでなく、データ可視化、フォーム、ダッシュボードなどを会話内で直接レンダリングできます。

**主なメリット:**
- **コンテキスト保持**: アプリは会話内に存在し、タブ切り替えが不要
- **双方向データフロー**: アプリはMCPサーバーのツールを呼び出し可能
- **セキュリティ**: サンドボックス化されたiframe内で実行

## アーキテクチャ

### 1. MCPリソース登録

**ファイル**: `src/mcp/server.ts`

`@modelcontextprotocol/ext-apps`の`registerAppResource`を使用してUIリソースを登録:

```typescript
import {
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";

const PREVIEW_RESOURCE_URI = "ui://serendie/component-preview.html";

// Register HTML template as MCP Apps resource
// Since the UI is bundled into a single HTML file using vite-plugin-singlefile,
// we don't need external CSP domains. All assets are inlined.
registerAppResource(
  mcpServer,
  "Serendie Component Preview",
  PREVIEW_RESOURCE_URI,
  { description: "Interactive preview of Serendie UI components" },
  async () => ({
    contents: [{
      uri: PREVIEW_RESOURCE_URI,
      mimeType: RESOURCE_MIME_TYPE,
      text: previewHtml,
    }]
  })
);
```

### 2. プレビューUIコンポーネント

**ソースファイル**: `src/mcp/ui/pages/preview.tsx`
**ビルド出力**: `src/mcp/ui/preview.html`

`@modelcontextprotocol/ext-apps/react`の`useApp`フックを使用してホストと通信:

```tsx
import { useComponentFromToolResult } from "../hooks/useMcpApp";
import { ComponentPreview } from "../../../components/Preview/ComponentPreview";

export const PreviewPage = () => {
  const { componentName, isLoading } = useComponentFromToolResult();
  const [selectedComponent, setSelectedComponent] = useState<string>("Button");

  useEffect(() => {
    if (componentName && availableComponents.includes(componentName)) {
      setSelectedComponent(componentName);
    }
  }, [componentName]);

  return (
    <div>
      {isLoading && <LoadingIndicator />}
      {!isLoading && <ComponentPreview componentName={selectedComponent} />}
    </div>
  );
};
```

### 3. MCP Apps Hook

**ファイル**: `src/mcp/ui/hooks/useMcpApp.ts`

`@modelcontextprotocol/ext-apps/react`の`useApp`フックをラップ:

```typescript
import { useApp, App } from "@modelcontextprotocol/ext-apps/react";

export function useMcpAppWithToolResult<T>() {
  const [toolResult, setToolResult] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { app, isConnected, error } = useApp({
    appInfo: { name: "Serendie Component Preview", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app: App) => {
      // ツール結果を受信
      app.ontoolresult = (params) => {
        const textContent = params.content?.find((c) => c.type === "text");
        if (textContent?.text) {
          setToolResult(JSON.parse(textContent.text));
        }
        setIsLoading(false);
      };
    },
  });

  return { app, toolResult, isConnected, isLoading, error };
}
```

### 4. ツール定義

**ファイル**: `src/mcp/tools/components.ts`

```typescript
mcpServer.registerTool(
  "get-component-detail",
  {
    title: "Get Component Detail",
    description: "...",
    _meta: {
      ui: {
        resourceUri: "ui://serendie/component-preview.html",
      },
    },
    inputSchema: { ... }
  },
  async ({ name }) => {
    // ツール実行ロジック
    return {
      content: [{ type: "text", text: JSON.stringify(componentDetail) }],
      structuredContent: componentDetail,
    };
  }
);
```

## データフロー

```
User: "Buttonコンポーネントを見せて"
    ↓
Host calls get-component-detail("Button")
    ↓
MCP Server responds:
  - content: JSON data (for model)
  - _meta.ui.resourceUri points to preview HTML
    ↓
Host fetches UI resource (ui://serendie/component-preview.html)
    ↓
React SPA receives tool result via App.ontoolresult
    ↓
Shows loading state (ProgressIndicatorIndeterminate)
    ↓
Validates component exists in availableComponents
    ↓
Renders ComponentPreview with selected component
    ↓
User sees interactive component preview!
```

## MCP Apps特有のフィールド

### _meta.ui (ツール定義)

```typescript
_meta: {
  ui: {
    resourceUri: "ui://serendie/component-preview.html",
  }
}
```

### リソースのCSP設定（必要な場合）

外部リソースを読み込む場合のみ、CSP設定が必要です:

```typescript
// リソースコンテンツ内の_metaに設定
_meta: {
  ui: {
    csp: {
      // 外部API/fetch用
      connectDomains: ["https://api.example.com"],
      // 外部スクリプト/スタイル/画像用
      resourceDomains: ["https://cdn.example.com"],
      // ネストされたiframe用
      frameDomains: ["https://embed.example.com"],
    },
  },
}
```

**注意**: Serendieプレビューは`vite-plugin-singlefile`ですべてのアセットをインライン化しているため、CSP設定は不要です。

## 開発環境でのテスト

### 1. プレビューUIのビルド

```bash
npm run build:preview
```

### 2. ローカル開発サーバー起動

```bash
npm run dev
```

### 3. MCPテスト

```bash
npm run test:mcp
```

### 4. basic-hostでテスト

```bash
# ext-appsリポジトリをクローン
git clone --branch "v$(npm view @modelcontextprotocol/ext-apps version)" --depth 1 https://github.com/modelcontextprotocol/ext-apps.git /tmp/mcp-ext-apps

# basic-hostを起動
cd /tmp/mcp-ext-apps/examples/basic-host
npm install
SERVERS='["http://localhost:4321/mcp"]' npm run start
# http://localhost:8080 を開く
```

### 5. トンネリング（外部ホスト接続用）

```bash
npx cloudflared tunnel --url http://localhost:4321
```

## サポートされているホスト

MCP Appsは以下のホストでサポートされています:
- [Claude](https://claude.ai) (Web)
- [Claude Desktop](https://claude.ai/download)
- [Visual Studio Code (Insiders)](https://code.visualstudio.com/insiders)
- [Goose](https://block.github.io/goose/)
- [Postman](https://postman.com)
- [MCPJam](https://www.mcpjam.com/)

## 本番デプロイ

```
Production: https://serendie.design/mcp/
Staging: https://dev.serendie-web.pages.dev/mcp/
```

## トラブルシューティング

### プレビューが表示されない

- `npm run build:preview` でプレビューHTMLを再生成
- ブラウザコンソールでエラーを確認
- `npm run test:mcp` でリソース登録を確認

### ツール結果が渡されない

- `App.ontoolresult` がハンドラ登録されているか確認
- `useApp`フックが正しく接続されているか確認

### CSPエラー

外部リソースを使用する場合:
- リソースコンテンツの`_meta.ui.csp`設定を確認
- camelCaseのフィールド名を使用: `connectDomains`, `resourceDomains`, `frameDomains`
- すべての外部オリジンが含まれているか確認

## 参考リンク

- [MCP Apps Documentation](https://modelcontextprotocol.io/docs/extensions/apps)
- [MCP Apps API Reference](https://modelcontextprotocol.github.io/ext-apps/api/)
- [Migration Guide from OpenAI Apps SDK](https://github.com/modelcontextprotocol/ext-apps/blob/main/docs/migrate_from_openai_apps.md)
- [GitHub Repository](https://github.com/modelcontextprotocol/ext-apps)
- [Serendie Design System](https://serendie.design/)
