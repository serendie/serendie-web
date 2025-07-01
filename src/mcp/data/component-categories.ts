/**
 * Component category definitions for the Serendie Design System
 */

export interface ComponentCategory {
  displayName: string;
  description: string;
  components: string[];
}

export const componentCategories: Record<string, ComponentCategory> = {
  Actions: {
    displayName: "アクション",
    description: "ボタン、リンク等",
    components: ["Button", "IconButton", "BottomNavigation"],
  },
  Inputs: {
    displayName: "入力",
    description: "入力系",
    components: [
      "TextField",
      "TextArea",
      "CheckBox",
      "RadioButton",
      "RadioGroup",
      "Select",
      "Switch",
      "Search",
      "ChoiceBox",
      "PasswordField",
    ],
  },
  Layout: {
    displayName: "レイアウト",
    description: "レイアウト系",
    components: [
      "Accordion",
      "AccordionGroup",
      "Tabs",
      "TabItem",
      "Divider",
      "List",
      "ListItem",
      "TopAppBar",
    ],
  },
  Display: {
    displayName: "表示",
    description: "表示系",
    components: [
      "Avatar",
      "Badge",
      "NotificationBadge",
      "DashboardWidget",
      "ProgressIndicator",
    ],
  },
  Feedback: {
    displayName: "フィードバック",
    description: "フィードバック系",
    components: [
      "Banner",
      "Toast",
      "Drawer",
      "ModalDialog",
      "DropdownMenu",
      "Pagination",
    ],
  },
  Other: {
    displayName: "その他",
    description: "その他",
    components: [],
  },
};

/**
 * Get category for a component name
 */
export function getCategoryForComponent(componentName: string): string {
  for (const [categoryKey, categoryData] of Object.entries(
    componentCategories
  )) {
    if (categoryData.components.includes(componentName)) {
      return categoryKey;
    }
  }
  return "Other";
}

/**
 * Get all category keys
 */
export function getCategoryKeys(): string[] {
  return Object.keys(componentCategories);
}

/**
 * Get category descriptions as a simple object
 */
export function getCategoryDescriptions(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(componentCategories)) {
    result[key] = value.description;
  }
  return result;
}
