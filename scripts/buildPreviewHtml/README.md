# Preview HTML Builder

このスクリプトは `src/mcp/ui/pages/preview.tsx` を単一の自己完結型HTMLファイルとして出力します。

## 概要

OpenAI Apps SDK用のコンポーネントプレビューページを、全てのReact/CSS/依存関係をインライン化した1つのHTMLファイルとして生成します。

## ビルド方法

```bash
npm run build:preview
```

## 出力

- **出力先**: `dist/mcp/ui/preview.html`
- **ファイルサイズ**: 約2MB（gzip圧縮で約468KB）
- **形式**: 自己完結型HTML（外部依存なし）

## 技術スタック

- **Vite**: ビルドツール
- **vite-plugin-singlefile**: 全アセットを単一HTMLにインライン化
- **@vitejs/plugin-react**: React JSX変換
- **PandaCSS**: スタイリング（自動的にバンドル）

## ファイル構成

```
scripts/buildPreviewHtml/
├── index.html       # HTMLテンプレート
├── main.tsx        # Reactエントリーポイント
├── vite.config.ts  # Vite設定
├── build.ts        # ビルドスクリプト
└── README.md       # このファイル
```

## 機能

生成されたHTMLファイルには以下が含まれます:

- ✅ React 18
- ✅ @serendie/ui の全コンポーネント
- ✅ PandaCSSスタイル
- ✅ 全サンプルコード（dynamic import経由）
- ✅ OpenAI Apps SDK連携コード

## 動作確認

生成されたHTMLファイルは、ブラウザで直接開くか、OpenAI Apps SDK経由で表示できます。

```bash
# ローカルで確認（HTTPサーバーが必要）
npx serve dist/mcp/ui
```

## トラブルシューティング

### ビルドエラー

モジュール解決エラーが出る場合は、`vite.config.ts`の`resolve.alias`を確認してください。

### ファイルサイズが大きい

- 全てのコンポーネントとサンプルコードがバンドルされるため、ファイルサイズは大きくなります
- gzip圧縮により、実際の転送サイズは約468KBです

### 外部アセットエラー

全てのアセットがインライン化されているため、外部依存はありません。
