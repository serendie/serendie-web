export const uiComponents = {
  ja: {
    "components.accordion.iconPlacement.title": "バリエーション",
    "components.accordion.iconPlacement.desc":
      "アコーディオンの展開状態を示すアイコンの位置 (行末または行頭) を選ぶことができます。実装時にはAccordionGroupを併用してください。",
    "components.avatar.size.title": "サイズ",
    "components.avatar.size.desc": "3種類のサイズから選択できます。",
    "components.avatar.variant.title": "バリエーション",
    "components.avatar.variant.desc":
      "任意の画像やテキストをアバターとして使用できます。特に画像をアバターとする場合は、初期値としてプレースホルダーを適切に設定してください。",
    "components.badge.size.title": "サイズ",
    "components.badge.size.desc": "サイズはSmall, Medium, Largeの3種類があります。",
    "components.badge.color.title": "カラー",
    "components.badge.color.desc":
      "例外的にリファレンストークンを参照する形でカラーバリエーションを用意しています。",
    "components.badge.closeButton.title": "バリエーション",
    "components.badge.closeButton.desc":
      "BadgeCloseButtonを渡すことで、絞り込みUIなどでChipとして使用できます。",
    "components.banner.variant.title": "バリエーション",
    "components.banner.variant.desc":
      "注意喚起のレベルに応じて使い分けてください。同じ画面内に同レベルのBannerを複数並べることは避けてください。",
    "components.bottomNavigation.basicUsage.title": "サンプル",
    "components.bottomNavigation.basicUsage.desc":
      "BottomNavigation内で、BottomNavigationItemを連ねて使用します。最大5タブ程度が目安です。それ以上になる場合は、Drawerなど別のナビゲーションを検討してください。",
    "components.bottomNavigation.itemStates.title": "バリエーション",
    "components.bottomNavigation.itemStates.desc":
      "BottomNavigationItemにはEnable状態とActive状態があります。またNotificationBadgeを組み合わせて使用できます。",
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
    "components.chart.pie.title": "円グラフ",
    "components.chart.pie.desc":
      "usePieChartPropsフックを使用することで、円グラフを作成できます。データの割合や構成比を視覚的に表現する際に使用します。",
    "components.chart.line.title": "折れ線グラフ",
    "components.chart.line.desc":
      "useLineChartPropsフックを使用することで、時系列データなどを表現する線グラフを作成できます。複数のデータ系列を同時に表示することも可能です。",
    "components.chart.bar.title": "棒グラフ",
    "components.chart.bar.desc":
      "useBarChartPropsフックを使用することで、棒グラフを作成できます。縦棒グラフと横棒グラフの両方に対応しています。",
    "components.chart.stackedBar.title": "積み上げ棒グラフ",
    "components.chart.stackedBar.desc":
      "複数のセグメントを積み上げて構成比を表現する、積み上げ棒グラフを作成できます。カテゴリー内の内訳を視覚化する際に使用します。",
    "components.checkBox.variant.title": "バリエーション",
    "components.checkBox.variant.desc":
      "選択肢を表すクリック可能なラベルが必ず必要です。補足テキストも追加できます。",
    "components.checkBox.state.title": "状態",
    "components.checkBox.state.desc":
      "EnabledとSelectedを基本とし、Disabledにより変更不可とします。",
    "components.choiceBox.variant.title": "バリエーション",
    "components.choiceBox.variant.desc":
      "2種類のバリエーションがあります。いずれもChoice Boxを単体で使用することは推奨されません。",
    "components.choiceBox.indeterminate.title": "Indeterminate状態",
    "components.choiceBox.indeterminate.desc":
      "CheckboxタイプのChoiceBoxでは、indeterminate状態（未確定状態）を指定することができます。indeterminateは、親チェックボックスが一部の子要素のみ選択されている場合など、部分的な選択状態を表現する際に使用できます。",
    "components.dashboardWidget.layoutOptions.title": "バリエーション",
    "components.dashboardWidget.layoutOptions.desc":
      "3パターンのレイアウトを用意しています。Placeholderにはグラフを表示することを想定しています。",
    "components.dataTable.basicUsage.title": "基本的な使用方法",
    "components.dataTable.basicUsage.desc":
      "DataTableの基本的な使用方法です。データと列定義を渡すことで基本的なテーブルが実装できます。",
    "components.dataTable.columnHelper.title": "カラム形式の指定",
    "components.dataTable.columnHelper.desc":
      "DataTableを使用する際の最初のステップは、テーブルのカラム形式を指定するためのColumnHelperの作成を行うことです。ColumnHelperはTypeScriptの型安全性を保ちながら、列の定義を簡単に行うためのヘルパー関数です。",
    "components.dataTable.sorting.title": "ソート機能",
    "components.dataTable.sorting.desc":
      "列ヘッダーをクリックすることで昇順・降順のソートが可能です。onSortingChangeを使用することでソート状態の変更を監視することが可能です。",
    "components.dataTable.selection.title": "選択機能",
    "components.dataTable.selection.desc":
      "enableRowSelectionプロパティで行選択機能の有効・無効を切り替えできます。選択状態の変更はonRowSelectionChangeコールバックで監視できます。",
    "components.dataTable.callbacks.title": "イベントハンドリング",
    "components.dataTable.callbacks.desc":
      "onRowSelectionChangeやonSortingChangeなどのコールバック関数を使用して、ユーザーのインタラクションに応答できます。この例では、選択された行に基づいてボタンを有効化し、モーダルダイアログで詳細を表示します。",
    "components.dataTable.dataTypes.title": "異なるデータ型への対応",
    "components.dataTable.dataTypes.desc":
      "ColumnHelperは型パラメータを受け取るため、異なるデータ型でも型安全にテーブルを作成できます。meta.getTypeで動的なスタイリングも可能です。",
    "components.datePicker.basic.title": "基本",
    "components.datePicker.basic.desc":
      "単一の日付を選択する基本的なデートピッカーです。",
    "components.datePicker.range.title": "日付範囲",
    "components.datePicker.range.desc":
      "開始日と終了日を選択できる範囲選択型のデートピッカーです。",
    "components.datePicker.states.title": "状態",
    "components.datePicker.states.desc":
      "4種類の状態があります。入力必須とする際はrequired propsを使用し、非活性とする際はdisabled propsを使用してください。",
    "components.datePicker.calendarOnly.title": "カレンダーのみ",
    "components.datePicker.calendarOnly.desc":
      "入力フィールドを表示せず、カレンダーだけを表示するモードです。",
    "components.divider.color.title": "カラー",
    "components.divider.color.desc": "視覚的な強弱に応じて使い分けてください。",
    "components.divider.orientation.title": "バリエーション",
    "components.divider.orientation.desc": "水平と垂直の2種類があります。",
    "components.drawer.placement.title": "バリエーション",
    "components.drawer.placement.desc":
      "左寄せと右寄せのほか、画面全体にDrawerを表示する (Full) こともできます。デスクトップなど表示領域が広い場合は、Fullの使用は推奨されません。",
    "components.dropdownMenu.variant.title": "バリエーション",
    "components.dropdownMenu.variant.desc":
      "メニューを総称するタイトルまたはアイコンを設定できます。",
    "components.iconButton.size.title": "サイズ",
    "components.iconButton.size.desc":
      "Small、Medium、Largeの3種類があります。SmallはPCなどの大きな画面でマウス操作をする前提で使用することを推奨しており、モバイルなどタッチデバイスでは非推奨です。",
    "components.iconButton.variant.title": "バリエーション",
    "components.iconButton.variant.desc":
      "3種類のバリエーションがあり、アクションの重要度に応じて使い分けてください。重要度が高いアクションにはFilledを使用し、その他のアクションにはGhostやOutlinedを使用してください。同一画面内に複数のFilledを並べることは非推奨です。",
    "components.iconButton.shape.title": "シェイプ",
    "components.iconButton.shape.desc": "CircleとRectangleの2種類があります。",
    "components.iconButton.state.title": "状態",
    "components.iconButton.state.desc":
      "バリエーションごとに4種類の状態があります。DisabledはTextFieldなど他のコンポーネントの状態と連動して使用してください。",
    "components.list.variant.title": "バリエーション",
    "components.list.variant.desc":
      "テキストや画像、通知バッジを組み合わせて使用できます。一覧から詳細にリンクする際は、Right Iconを使用してください。",
    "components.list.state.title": "状態",
    "components.list.state.desc":
      "4つの状態があります。メニューにおいて非活性状態を示すときにDisabledを、選択状態を示すときにSelectedを使用してください。",
    "components.modalDialog.basicUsage.title": "サンプル",
    "components.modalDialog.basicUsage.desc":
      "Modal Dialogを閉じるボタンは必ず必要です。また背景レイヤー (scrim) をクリックすることで閉じることができます。",
    "components.notificationBadge.size.title": "サイズ",
    "components.notificationBadge.size.desc": "SmallとMediumの2種類のサイズがあります。",
    "components.notificationBadge.color.title": "カラー",
    "components.notificationBadge.color.desc":
      "PrimaryとSecondaryの2種類のカラーがあります。Secondaryはテーマカラーに準じます。",
    "components.notificationBadge.variant.title": "バリエーション",
    "components.notificationBadge.variant.desc":
      "通知数が99以上の場合は省略表示されます。数字を表示せず、通知が存在することだけを示すことも可能です。重要度や表示領域に応じて使い分けてください。",
    "components.pagination.basicUsage.title": "サンプル",
    "components.pagination.basicUsage.desc":
      "countプロパティでページ数を指定します。現在ページの前後2ページまで表示され、それ以上は省略記号（…）で表示されます。",
    "components.pagination.siblingCount.title": "表示数の調整",
    "components.pagination.siblingCount.desc":
      "siblingCountプロパティを調整することで、現在ページの前後に表示するページ数を変更できます。この例では4に設定しているため、より多くのページ番号が表示されます。",
    "components.progressIndicator.size.title": "サイズ",
    "components.progressIndicator.size.desc":
      "Circular は Small、Medium、Large の3種類があります。Linear は Medium と Large を使用してください。",
    "components.progressIndicator.determinate.title": "確定値（Determinate）",
    "components.progressIndicator.determinate.desc":
      "処理の進捗が数値で把握できる場合に使用します。Linearは横方向に進捗が伸び、Circularは円弧で進捗を示します。値は value / max から算出されます。",
    "components.progressIndicator.indeterminate.title": "不確定値（Indeterminate）",
    "components.progressIndicator.indeterminate.desc":
      "処理時間が読めない待機状態を示す場合に使用します。Linearはスライドアニメーション、Circularは回転する円弧アニメーションで待機を表現します。",
    "components.progressIndicator.indeterminateColor.title": "カラー（Indeterminate）",
    "components.progressIndicator.indeterminateColor.desc":
      "不確定値では color を Primary と Subtle から選べます。状況に応じて重要度や背景とのコントラストを考慮して使い分けてください。",
    "components.radioButton.variant.title": "バリエーション",
    "components.radioButton.variant.desc":
      "選択肢を表すクリック可能なラベルが必ず必要です。補足テキストも追加できます。",
    "components.radioButton.state.title": "状態",
    "components.radioButton.state.desc":
      "EnabledとSelectedを基本とし、Disabledにより変更不可とします。",
    "components.search.size.title": "サイズ",
    "components.search.size.desc": "SmallとMediumの2種類があります。",
    "components.search.state.title": "状態",
    "components.search.state.desc":
      "3種類の状態があります。非活性とする際はdisabled propsを使用してください。",
    "components.select.size.title": "サイズ",
    "components.select.size.desc": "Small、Mediumの2種類があります。",
    "components.select.state.title": "状態",
    "components.select.state.desc":
      "3種類の状態があります。エラー状態においては、エラーの詳細をメッセージ表示してください。",
    "components.switch.basicUsage.title": "サンプル",
    "components.switch.basicUsage.desc":
      "スイッチのオン/オフはイベントのトリガーとなります。onCheckedChangeハンドラで、イベント処理を実装してください。",
    "components.switch.state.title": "状態",
    "components.switch.state.desc":
      "5種類の状態があります。非活性とする際はdisabled propsを使用してください。",
    "components.tabs.basicUsage.title": "サンプル",
    "components.tabs.basicUsage.desc": "Tabs内で、TabItemを連ねて使用します。",
    "components.tabs.notificationBadge.title": "バリエーション",
    "components.tabs.notificationBadge.desc":
      "TabItemには通知バッジ付きのバリエーションがあります。",
    "components.tabs.state.title": "状態",
    "components.tabs.state.desc":
      "TabItemは計6種類の状態があります。非活性とする際はdisabled propsを使用してください。",
    "components.textArea.state.title": "状態",
    "components.textArea.state.desc":
      "4種類の状態があります。入力必須とする際はrequired propsを使用し、非活性とする際はdisabled propsを使用してください。",
    "components.textArea.autoAdjustHeight.title": "高さの自動調整",
    "components.textArea.autoAdjustHeight.desc":
      "入力された内容に応じて高さを変更したい場合には、autoAdjustHeight propsを使用してください。",
    "components.textField.state.title": "状態",
    "components.textField.state.desc":
      "4種類の状態があります。入力必須とする際はrequired propsを使用し、非活性とする際はdisabled propsを使用してください。",
    "components.textField.passwordField.title": "Password Field",
    "components.textField.passwordField.desc":
      "パスワード入力用のテキストフィールドです。パスワードの表示・非表示を切り替えることができます。",
    "components.toast.variant.title": "バリエーション",
    "components.toast.variant.desc":
      "メッセージの意味や重要度に応じて3種類を使い分けてください。Toastが消えるまでの秒数は任意に設定できます。詳しくはサンプルコードを参照してください。",
    "components.tooltip.basicUsage.title": "基本的な使い方",
    "components.tooltip.basicUsage.desc":
      "要素にホバーするとツールチップが表示されます。アイコンボタンやリンクなど、追加の説明が必要な要素に使用してください。",
    "components.tooltip.placement.title": "配置",
    "components.tooltip.placement.desc":
      "ツールチップは8方向に配置できます。要素の位置や画面の端を考慮して、適切な配置を選択してください。",
    "components.tooltip.state.title": "状態",
    "components.tooltip.state.desc":
      "disabledプロパティでツールチップを無効化できます。フォームの状態や権限に応じて動的に制御してください。",
    "components.topAppBar.variant.title": "バリエーション",
    "components.topAppBar.variant.desc":
      "ナビゲーション用のNavBarと、ページタイトル用のTitleBarの2種類で構成されます。TopAppBarを連ねて使用することで、多様なレイアウトに対応します。",
  },
  en: {
    "components.accordion.iconPlacement.title": "Icon placement",
    "components.accordion.iconPlacement.desc":
      "Choose where the expand/collapse icon appears (line end or start). Use together with AccordionGroup when implementing.",
    "components.avatar.size.title": "Size",
    "components.avatar.size.desc": "Three sizes are available.",
    "components.avatar.variant.title": "Variants",
    "components.avatar.variant.desc":
      "You can use any image or text as an avatar. When using an image, set a suitable placeholder as the initial value.",
    "components.badge.size.title": "Size",
    "components.badge.size.desc": "Available in Small, Medium, and Large.",
    "components.badge.color.title": "Color",
    "components.badge.color.desc":
      "Color variations are exceptionally provided by referencing reference tokens.",
    "components.badge.closeButton.title": "Variants",
    "components.badge.closeButton.desc":
      "Pass BadgeCloseButton to use it like a chip in filtering UIs.",
    "components.banner.variant.title": "Variants",
    "components.banner.variant.desc":
      "Choose based on alert severity. Avoid placing multiple banners of the same level on a single screen.",
    "components.bottomNavigation.basicUsage.title": "Example",
    "components.bottomNavigation.basicUsage.desc":
      "Use BottomNavigation together with consecutive BottomNavigationItems. Up to about five tabs is a guideline; consider Drawer when you need more.",
    "components.bottomNavigation.itemStates.title": "Variants",
    "components.bottomNavigation.itemStates.desc":
      "BottomNavigationItem has enabled and active states and can be combined with NotificationBadge.",
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
    "components.chart.pie.title": "Pie chart",
    "components.chart.pie.desc":
      "Create pie charts with the usePieChartProps hook to visualize ratios and composition.",
    "components.chart.line.title": "Line chart",
    "components.chart.line.desc":
      "Create line charts with the useLineChartProps hook for time series and multiple data series.",
    "components.chart.bar.title": "Bar chart",
    "components.chart.bar.desc":
      "Create bar charts with the useBarChartProps hook. Supports both vertical and horizontal bars.",
    "components.chart.stackedBar.title": "Stacked bar chart",
    "components.chart.stackedBar.desc":
      "Stack segments to show composition within a category when visualizing breakdowns.",
    "components.checkBox.variant.title": "Variants",
    "components.checkBox.variant.desc":
      "Clickable labels for options are required and can include supporting text.",
    "components.checkBox.state.title": "States",
    "components.checkBox.state.desc":
      "Enabled and Selected are basic; Disabled makes it non-interactive.",
    "components.choiceBox.variant.title": "Variants",
    "components.choiceBox.variant.desc":
      "There are two variants. Using a ChoiceBox on its own is not recommended.",
    "components.choiceBox.indeterminate.title": "Indeterminate state",
    "components.choiceBox.indeterminate.desc":
      "Checkbox-type ChoiceBox can be set to indeterminate to represent partial selection (e.g., some child items selected).",
    "components.dashboardWidget.layoutOptions.title": "Variants",
    "components.dashboardWidget.layoutOptions.desc":
      "Three layout patterns are available. Placeholder is intended for displaying charts.",
    "components.dataTable.basicUsage.title": "Basic usage",
    "components.dataTable.basicUsage.desc":
      "Create a basic table by passing data and column definitions.",
    "components.dataTable.columnHelper.title": "Column helper",
    "components.dataTable.columnHelper.desc":
      "Start by creating a ColumnHelper to define table columns with type safety in TypeScript.",
    "components.dataTable.sorting.title": "Sorting",
    "components.dataTable.sorting.desc":
      "Click column headers to sort ascending/descending. Use onSortingChange to watch changes.",
    "components.dataTable.selection.title": "Selection",
    "components.dataTable.selection.desc":
      "Toggle row selection with enableRowSelection. Watch selection changes via onRowSelectionChange.",
    "components.dataTable.callbacks.title": "Event handling",
    "components.dataTable.callbacks.desc":
      "Use callbacks such as onRowSelectionChange and onSortingChange to respond to interactions. In this example, selected rows enable a button and show details in a modal dialog.",
    "components.dataTable.dataTypes.title": "Handling data types",
    "components.dataTable.dataTypes.desc":
      "ColumnHelper accepts type parameters, enabling type-safe tables across data shapes. meta.getType also allows dynamic styling.",
    "components.datePicker.basic.title": "Basic",
    "components.datePicker.basic.desc":
      "A basic date picker for selecting a single date.",
    "components.datePicker.range.title": "Date range",
    "components.datePicker.range.desc":
      "A range picker that lets users choose a start and end date.",
    "components.datePicker.states.title": "States",
    "components.datePicker.states.desc":
      "There are four states. Use the required prop for mandatory input and disabled for non-interactive.",
    "components.datePicker.calendarOnly.title": "Calendar only",
    "components.datePicker.calendarOnly.desc":
      "Shows only the calendar without an input field.",
    "components.divider.color.title": "Color",
    "components.divider.color.desc": "Choose strength based on visual emphasis.",
    "components.divider.orientation.title": "Orientation",
    "components.divider.orientation.desc": "Available in horizontal and vertical.",
    "components.drawer.placement.title": "Variants",
    "components.drawer.placement.desc":
      "Supports left and right placement, plus a full-screen mode. Avoid Full on spacious desktop layouts.",
    "components.dropdownMenu.variant.title": "Variants",
    "components.dropdownMenu.variant.desc":
      "You can set a label or icon to represent the menu.",
    "components.iconButton.size.title": "Size",
    "components.iconButton.size.desc":
      "Small, Medium, and Large are available. Small assumes pointer use on large screens and is discouraged on touch devices.",
    "components.iconButton.variant.title": "Variants",
    "components.iconButton.variant.desc":
      "Three variants; choose by action importance. Use Filled for primary actions and Ghost or Outlined for secondary ones. Avoid multiple Filled buttons on one screen.",
    "components.iconButton.shape.title": "Shape",
    "components.iconButton.shape.desc": "Circle and Rectangle are available.",
    "components.iconButton.state.title": "States",
    "components.iconButton.state.desc":
      "Each variant has four states. Align Disabled with related components such as TextField.",
    "components.list.variant.title": "Variants",
    "components.list.variant.desc":
      "Combine text, images, and notification badges. Use a right icon when linking to details.",
    "components.list.state.title": "States",
    "components.list.state.desc":
      "There are four states. Use Disabled for inactive menu items and Selected when an item is chosen.",
    "components.modalDialog.basicUsage.title": "Example",
    "components.modalDialog.basicUsage.desc":
      "Always provide a close button. Clicking the background layer (scrim) should also close the dialog.",
    "components.notificationBadge.size.title": "Size",
    "components.notificationBadge.size.desc": "Two sizes: Small and Medium.",
    "components.notificationBadge.color.title": "Color",
    "components.notificationBadge.color.desc":
      "Two colors: Primary and Secondary. Secondary follows the theme color.",
    "components.notificationBadge.variant.title": "Variants",
    "components.notificationBadge.variant.desc":
      "Counts of 99+ are truncated. You can also show a dot without a number; choose based on importance and space.",
    "components.pagination.basicUsage.title": "Example",
    "components.pagination.basicUsage.desc":
      "Set total pages with the count prop. Pages within two steps are shown; farther pages collapse to ellipsis.",
    "components.pagination.siblingCount.title": "Adjust visible range",
    "components.pagination.siblingCount.desc":
      "Change how many pages appear around the current page via siblingCount. In this example it's 4 to show more numbers.",
    "components.progressIndicator.size.title": "Size",
    "components.progressIndicator.size.desc":
      "Circular offers Small, Medium, Large. Use Medium or Large for Linear.",
    "components.progressIndicator.determinate.title": "Determinate",
    "components.progressIndicator.determinate.desc":
      "Use when progress can be quantified. Linear grows horizontally; Circular uses an arc. Progress is value / max.",
    "components.progressIndicator.indeterminate.title": "Indeterminate",
    "components.progressIndicator.indeterminate.desc":
      "Use when duration is unknown. Linear shows sliding animation; Circular shows a rotating arc.",
    "components.progressIndicator.indeterminateColor.title": "Indeterminate colors",
    "components.progressIndicator.indeterminateColor.desc":
      "Choose between Primary and Subtle for indeterminate. Pick based on importance and background contrast.",
    "components.radioButton.variant.title": "Variants",
    "components.radioButton.variant.desc":
      "Clickable labels for options are required and can include supporting text.",
    "components.radioButton.state.title": "States",
    "components.radioButton.state.desc":
      "Enabled and Selected are basic; Disabled makes it non-interactive.",
    "components.search.size.title": "Size",
    "components.search.size.desc": "Two sizes: Small and Medium.",
    "components.search.state.title": "States",
    "components.search.state.desc":
      "Three states available. Use the disabled prop when non-interactive.",
    "components.select.size.title": "Size",
    "components.select.size.desc": "Two sizes: Small and Medium.",
    "components.select.state.title": "States",
    "components.select.state.desc":
      "Three states. In error state, show details in a message.",
    "components.switch.basicUsage.title": "Example",
    "components.switch.basicUsage.desc":
      "Switch toggle triggers events. Implement handling in onCheckedChange.",
    "components.switch.state.title": "States",
    "components.switch.state.desc":
      "Five states. Use the disabled prop when non-interactive.",
    "components.tabs.basicUsage.title": "Example",
    "components.tabs.basicUsage.desc": "Use multiple TabItems within Tabs.",
    "components.tabs.notificationBadge.title": "Variants",
    "components.tabs.notificationBadge.desc":
      "TabItem has a variant with a notification badge.",
    "components.tabs.state.title": "States",
    "components.tabs.state.desc":
      "TabItem has six states. Use the disabled prop when non-interactive.",
    "components.textArea.state.title": "States",
    "components.textArea.state.desc":
      "There are four states. Use required for mandatory input and disabled when non-interactive.",
    "components.textArea.autoAdjustHeight.title": "Auto height",
    "components.textArea.autoAdjustHeight.desc":
      "Use the autoAdjustHeight prop to grow the height as users type.",
    "components.textField.state.title": "States",
    "components.textField.state.desc":
      "There are four states. Use required for mandatory input and disabled when non-interactive.",
    "components.textField.passwordField.title": "Password Field",
    "components.textField.passwordField.desc":
      "A text field for passwords that can toggle visibility.",
    "components.toast.variant.title": "Variants",
    "components.toast.variant.desc":
      "Choose among three types based on meaning and importance. You can set the duration before the toast disappears; see sample code for details.",
    "components.tooltip.basicUsage.title": "Basic usage",
    "components.tooltip.basicUsage.desc":
      "Shows a tooltip on hover. Use for elements like icon buttons or links that need extra explanation.",
    "components.tooltip.placement.title": "Placement",
    "components.tooltip.placement.desc":
      "Can be placed in eight directions. Choose placement considering element position and viewport edges.",
    "components.tooltip.state.title": "States",
    "components.tooltip.state.desc":
      "disable the tooltip with the disabled prop. Control it dynamically based on form state or permissions.",
    "components.topAppBar.variant.title": "Variants",
    "components.topAppBar.variant.desc":
      "Consists of NavBar for navigation and TitleBar for page titles. Combine multiple TopAppBars to support diverse layouts.",
  },
} as const;
