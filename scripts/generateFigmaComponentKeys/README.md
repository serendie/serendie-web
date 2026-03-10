# Generate Figma Component Keys

Figma REST APIからコンポーネント情報を取得し、`component-keys.json`を生成するスクリプト。

## Purpose

Figmaファイル内のComponent SetおよびComponentの情報を取得し、以下をJSON形式で出力する:

- コンポーネントのキー・ノードID
- バリアントプロパティ（VARIANT, BOOLEAN, TEXT, INSTANCE_SWAP）
- Component Set / Component の種別

## Usage

```bash
npm run build:figma-component-keys
```

出力先を変更する場合:

```bash
npm run build:figma-component-keys -- --out path/to/output.json
```

## Environment Variables

以下の環境変数が必要。未設定の場合はwarningを出してスキップする。

| 変数名 | 説明 |
|---|---|
| `FIGMA_ACCESS_TOKEN` | Figma APIアクセストークン（`PERSONAL_ACCESS_TOKEN`, `FIGMA_PERSONAL_ACCESS_TOKEN` でも可） |
| `FIGMA_FILE_KEY` | 対象FigmaファイルのキーID（`FILE_KEY` でも可） |

`.env`ファイルに記述すると`dotenv`経由で自動読み込みされる。

## Output

デフォルトの出力先は `public/assets/component-keys.json`。このファイルは`.gitignore`に含まれており、ビルド時に生成される。

## Generated Data Structure

各コンポーネントの情報:

- `key`: Figmaコンポーネントキー
- `name`: コンポーネント名
- `description`: 説明
- `nodeId`: FigmaノードID
- `type`: `COMPONENT_SET` または `COMPONENT`
- `componentProperties`: プロパティ定義の配列（存在する場合）
  - `VARIANT`: `options`（選択肢の配列）
  - `BOOLEAN`: `defaultValue`
  - `TEXT`: `defaultValue`
  - `INSTANCE_SWAP`: `preferredComponentSets`（参照先のComponent Set名の配列）

## File Structure

```
scripts/generateFigmaComponentKeys/
├── index.ts    # CLIエントリポイント
├── figma.ts    # Figma REST APIクライアント・環境変数解決
├── mapper.ts   # APIレスポンスからcomponent-keys形式への変換
├── store.ts    # JSON出力（ソート・正規化）
├── options.ts  # CLIオプション解析
├── types.ts    # 型定義
└── __tests__/  # テスト
```
