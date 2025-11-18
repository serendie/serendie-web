export const uiComponents = {
  ja: {
    "components.button.size.title": "サイズ",
    "components.button.size.desc":
      "SmallとMediumの2種類があります。SmallはPCなどの大きな画面でマウス操作をする前提で使用することを推奨しており、モバイルなどタッチデバイスでは非推奨です。Mediumは画面サイズにかかわらず使用できます。",
    "components.button.variant.title": "バリエーション",
    "components.button.variant.desc":
      "4種類のバリエーションがあり、アクションの重要度に応じて使い分けてください。サブミットなど重要度が高いアクションにはFilledを使用し、キャンセルなどその他のアクションにはGhostやOutlinedを使用してください。同一画面内に複数のFilledを並べることは非推奨です。",
    "components.button.icon.title": "アイコン付きボタン",
    "components.button.icon.desc":
      "ラベルの左右にアイコンを入れることができます。ボタンがトリガーするアクションを視覚的にユーザーに伝えることができます。",
    "components.button.state.title": "状態",
    "components.button.state.desc":
      "バリエーションごとに5種類の状態があります。DisabledはTextFieldなど他のコンポーネントの状態と連動して使用してください。ボタン押下後にアクションを即座に処理できない場合は、Loadingを使いユーザーに待ち状態を伝えてください。",
  },
  en: {
    "components.button.size.title": "Size",
    "components.button.size.desc":
      "There are two sizes: Small and Medium. Use Small when assuming mouse interaction on large screens such as desktop; avoid it on touch devices. Medium can be used regardless of screen size.",
    "components.button.variant.title": "Variants",
    "components.button.variant.desc":
      "There are four variants. Choose based on action importance: use Filled for high-priority actions (e.g., submit), and Ghost or Outlined for secondary actions such as cancel. Avoid placing multiple Filled buttons on the same screen.",
    "components.button.icon.title": "Buttons with icons",
    "components.button.icon.desc":
      "Icons can be placed to the left or right of the label to visually convey the action the button triggers.",
    "components.button.state.title": "States",
    "components.button.state.desc":
      "Each variant has five states. Align Disabled with the state of related components (e.g., TextField). If the action cannot complete immediately after press, use Loading to indicate the waiting state.",
  },
} as const;
