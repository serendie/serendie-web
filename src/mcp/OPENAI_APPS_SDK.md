# OpenAI ChatGPT Apps SDK Integration

このドキュメントでは、Serendie MCP ServerのOpenAI ChatGPT Apps SDK統合について説明します。

## 概要

`get-component-detail` ツールがOpenAI Apps SDKに対応し、ChatGPT上でSerendieコンポーネントのライブプレビューを表示できるようになりました。

## アーキテクチャ

### 1. MCPリソース登録

**ファイル**: `src/mcp/server.ts`

Viteの`?raw`インポートを使用して、ビルド済みのHTMLをMCPリソースとして登録:

```typescript
// Viteの?rawインポートでHTMLを文字列として読み込み
import previewHtml from "./ui/preview.html?raw";

mcpServer.registerResource(
  "component-preview-widget",
  "ui://serendie/component-preview.html",
  {},
  async () => ({
    contents: [{
      uri: "ui://serendie/component-preview.html",
      mimeType: "text/html+skybridge",
      text: previewHtml,
      _meta: {
        "openai/widgetPrefersBorder": true,
        "openai/widgetDescription": "Interactive preview of Serendie UI components with live samples and code examples",
        "openai/widgetDomain": "https://serendie.design",
        // CSP設定（外部リソース読み込み制御）
        "openai/widgetCSP": {
          connect_domains: [
            "https://dev.serendie-web.pages.dev",
            "https://serendie.design",
          ],
          resource_domains: [
            "https://dev.serendie-web.pages.dev",
            "https://serendie.design",
          ],
        },
      }
    }]
  })
);
```

### 2. プレビューUIコンポーネント

**ソースファイル**: `src/mcp/ui/pages/preview.tsx`
**ビルド出力**: `src/mcp/ui/preview.html`

React SPAとしてビルドされたプレビューコンポーネント。OpenAI Apps SDKの`toolOutput`を`useToolOutput`フックで受け取り、対応するコンポーネントプレビューを表示します。

```tsx
import { useToolOutput } from "../hooks/useOpenAiGlobal";
import { ComponentPreview } from "../../../components/Preview/ComponentPreview";
import { availableComponents } from "../../../components/Preview/sampleCodeRegistry";
import { ProgressIndicatorIndeterminate } from "@serendie/ui";

interface ToolOutput {
  componentName?: string;
  name?: string;
}

export const PreviewPage = () => {
  const toolOutput = useToolOutput<ToolOutput>();
  const [selectedComponent, setSelectedComponent] = useState<string>("Button");

  // toolOutputがnull/undefinedの間はローディング表示
  const isLoading = !toolOutput;

  useEffect(() => {
    if (toolOutput) {
      // toolOutputからコンポーネント名を取得
      const componentName =
        toolOutput?.componentName || toolOutput?.name || "Button";

      // コンポーネントの存在確認
      if (availableComponents.includes(componentName)) {
        setSelectedComponent(componentName);
      } else {
        setSelectedComponent("Button"); // フォールバック
      }
    }
  }, [toolOutput]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* ローディングオーバーレイ */}
      {isLoading && (
        <div style={{ /* ローディングスタイル */ }}>
          <ProgressIndicatorIndeterminate type="circular" size="large" />
          <div>Loading component...</div>
        </div>
      )}

      {/* コンポーネントプレビュー */}
      {!isLoading && (
        <ComponentPreview componentName={selectedComponent} />
      )}
    </div>
  );
};
```

**特徴**:
- ✅ `useToolOutput`フックでOpenAI Apps SDKからデータを受信
- ✅ ローディング状態の表示（`ProgressIndicatorIndeterminate`使用）
- ✅ コンポーネントの存在確認とフォールバック処理
- ✅ Cloudflare Workers互換（fsモジュール不使用）

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
  // 完全なコンポーネント詳細データをstructuredContentとして返す
  structuredContent: validatedResponse,
};
```

**structuredContent の内容**（GetComponentDetailResponseSchema準拠）:
```typescript
{
  name: "Button",
  slug: "button",
  exists: true,
  displayName: "ボタン",
  description: "アクションをトリガーするためのクリック可能なコンポーネント",
  category: "Actions",
  lastUpdated: "2024-11-01",
  documentationUrl: "https://serendie.design/components/button",
  importStatement: "import { Button } from \"@serendie/ui\";",
  props: [...],
  examples: [...],
  storybookUrls: [...],
  usage: { basic: "...", withProps: "..." },
  relatedComponents: [...]
}
```

**設計のポイント**:
- ✅ `structuredContent`は完全なコンポーネント詳細データを含む
- ✅ プレビューUIでは`name`または`componentName`を使用してコンポーネントを特定
- ✅ Zodスキーマによる型安全性の確保

## データフロー

```
ChatGPT User Query: "Buttonコンポーネントを見せて"
    ↓
ChatGPT calls get-component-detail("Button")
    ↓
MCP Server responds:
  - content: JSON data (for model)
  - structuredContent: 完全なコンポーネント詳細データ
    ↓
ChatGPT renders HTML widget (ui://serendie/component-preview.html)
    ↓
React SPA receives toolOutput via useToolOutput hook
    ↓
Shows loading state (ProgressIndicatorIndeterminate)
    ↓
Validates component exists in availableComponents
    ↓
Renders ComponentPreview with selected component
    ↓
User sees interactive component preview!
```

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

### structuredContent (ツールレスポンス)

UIコンポーネントにデータを渡すフィールド（完全なコンポーネント詳細データ）:

```typescript
structuredContent: validatedResponse  // GetComponentDetailResponseSchema準拠
```

プレビューUIでは以下のフィールドを使用:
- `name` または `componentName`: コンポーネントの特定に使用

### リソースの _meta

HTMLリソース自体のメタデータ:

```typescript
_meta: {
  // ウィジェットに境界線を表示
  "openai/widgetPrefersBorder": true,
  // ウィジェットの説明（モデル用）
  "openai/widgetDescription": "Interactive preview of Serendie UI components with live samples and code examples",
  // ウィジェットのドメイン
  "openai/widgetDomain": "https://serendie.design",
  // CSP設定（外部リソース読み込み制御）
  "openai/widgetCSP": {
    connect_domains: [
      "https://dev.serendie-web.pages.dev",
      "https://serendie.design",
    ],
    resource_domains: [
      "https://dev.serendie-web.pages.dev",
      "https://serendie.design",
    ],
  },
}
```

## 開発環境でのテスト

### 1. プレビューUIのビルド

```bash
npm run build:preview
```

`src/mcp/ui/preview.html`が生成されます。

### 2. ローカル開発サーバー起動

```bash
npm run dev
```

### 3. MCP Inspectorでテスト

```bash
npm run test:mcp
```

以下を確認:
- リソース `ui://serendie/component-preview.html` が登録されているか
- `get-component-detail` レスポンスに `structuredContent` が含まれているか
- HTMLテンプレートが正しく生成されているか

### 4. ngrokでトンネリング（OpenAI接続用）

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
- `src/mcp/ui/preview.html` が存在するか確認（`npm run build:preview` で生成）

### structuredContentが渡されない

- `structuredContent` フィールドが正しく設定されているか確認
- MCP Inspectorでレスポンスを確認

### HTMLテンプレートが読み込まれない

- リソースURIが正しいか確認: `ui://serendie/component-preview.html`
- MIME Typeが正しいか確認: `text/html+skybridge`
- リソースが登録されているか `npm run test:mcp` で確認

### ローディングが終わらない

- `toolOutput` がUIに渡されているか確認
- ブラウザコンソールで `[Preview] toolOutput:` ログを確認

## 今後の拡張

- [x] CSP設定の追加（外部リソース読み込み制御）
- [x] ローディング状態の改善
- [ ] エラーハンドリングの強化
- [ ] コンポーネント内からのツール呼び出し（widgetAccessible）
- [ ] 複数サンプルのタブ切り替えUI改善

## 参考リンク

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk/build/mcp-server)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Serendie Design System](https://serendie.design/)
