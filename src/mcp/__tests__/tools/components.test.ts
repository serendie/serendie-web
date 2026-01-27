import { describe, it, expect, vi, beforeAll } from "vitest";
import { z } from "zod/v3";
import { readFile } from "fs/promises";
import {
  GetComponentsResponseSchema,
  GetComponentDetailResponseSchema,
} from "../../schemas/components";

// Mock fs/promises
vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
}));

// Mock data structure matching components-manifest.json
const mockComponentsManifest = [
  {
    name: "Button",
    displayName: "ボタン",
    description:
      "アクションをトリガーするためのクリック可能なコンポーネントです。",
    category: "Actions",
    hasDocumentation: true,
    source: "mdx" as const,
    lastUpdated: "2024-11-1",
    relatedComponents: [], // Button has no related components
    props: [
      {
        name: "styleType",
        type: "enum",
        required: false,
        description: "",
      },
      {
        name: "size",
        type: "enum",
        required: false,
        description: "",
      },
    ],
    examples: [
      {
        title: "Size",
        description: "",
        code: 'import { Button } from "@serendie/ui";\n\nexport function SizeSample() {\n  return <Button>Click me</Button>;\n}',
        fileName: "SizeSample.tsx",
        language: "tsx",
      },
    ],
    storybookUrls: [
      {
        title: "サイズ",
        path: "/story/components-button--medium",
        variant: "medium",
      },
    ],
  },
  {
    name: "Icon Button",
    displayName: "アイコンボタン",
    description: "アイコンのみを表示するボタンコンポーネントです。",
    category: "Actions",
    hasDocumentation: true,
    source: "mdx" as const,
    lastUpdated: "2024-11-1",
    relatedComponents: [], // IconButton has no related components
    props: [
      {
        name: "icon",
        type: "ReactElement",
        required: true,
        description: "",
      },
    ],
    examples: [],
    storybookUrls: [],
  },
  {
    name: "Text Field",
    displayName: "テキストフィールド",
    description: "ユーザーがテキストを入力するためのコンポーネントです。",
    category: "Inputs",
    hasDocumentation: true,
    source: "mdx" as const,
    lastUpdated: "2024-11-1",
    relatedComponents: [], // TextField has no related components
    props: [
      {
        name: "value",
        type: "string",
        required: false,
        description: "",
      },
    ],
    examples: [],
    storybookUrls: [],
  },
  {
    name: "Select",
    displayName: "セレクト",
    description: "選択肢から一つを選ぶためのコンポーネントです。",
    category: "Inputs",
    hasDocumentation: true,
    source: "mdx" as const,
    lastUpdated: "2024-11-1",
    relatedComponents: [], // Select has no related components
    props: [],
    examples: [],
    storybookUrls: [],
  },
  {
    name: "Modal Dialog",
    displayName: "モーダルダイアログ",
    description:
      "アプリケーションを覆うレイヤー上にダイアログを表示するコンポーネントです。",
    category: "Feedback",
    hasDocumentation: true,
    source: "mdx" as const,
    lastUpdated: "2024-11-1",
    relatedComponents: [], // ModalDialog has no related components
    props: [],
    examples: [],
    storybookUrls: [],
  },
  // Add components with related components (like Accordion/AccordionGroup)
  {
    name: "Accordion",
    displayName: "アコーディオン",
    description:
      "折りたたみ可能なコンテンツセクションを提供するコンポーネントです。",
    category: "Layout",
    hasDocumentation: true,
    source: "mdx" as const,
    lastUpdated: "2024-11-1",
    relatedComponents: ["AccordionGroup"], // Accordion is related to AccordionGroup
    props: [
      {
        name: "title",
        type: "string",
        required: true,
        description: "アコーディオンのタイトル",
      },
      {
        name: "isExpanded",
        type: "boolean",
        required: false,
        description: "展開状態",
      },
    ],
    examples: [],
    storybookUrls: [],
  },
  {
    name: "AccordionGroup",
    displayName: "アコーディオングループ",
    description: "複数のアコーディオンをグループ化するコンポーネントです。",
    category: "Layout",
    hasDocumentation: true,
    source: "mdx" as const,
    lastUpdated: "2024-11-1",
    relatedComponents: ["Accordion"], // AccordionGroup is related to Accordion
    props: [
      {
        name: "allowMultiple",
        type: "boolean",
        required: false,
        description: "複数のアコーディオンを同時に開くことを許可",
      },
    ],
    examples: [],
    storybookUrls: [],
  },
  {
    name: "Tabs",
    displayName: "タブ",
    description: "タブで切り替え可能なコンテンツを提供するコンポーネントです。",
    category: "Layout",
    hasDocumentation: true,
    source: "mdx" as const,
    lastUpdated: "2024-11-1",
    relatedComponents: ["TabItem"], // Tabs is related to TabItem
    props: [
      {
        name: "selectedIndex",
        type: "number",
        required: false,
        description: "選択されているタブのインデックス",
      },
    ],
    examples: [],
    storybookUrls: [],
  },
  {
    name: "TabItem",
    displayName: "タブアイテム",
    description: "タブの個別アイテムを表すコンポーネントです。",
    category: "Layout",
    hasDocumentation: true,
    source: "mdx" as const,
    lastUpdated: "2024-11-1",
    relatedComponents: ["Tabs"], // TabItem is related to Tabs
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        description: "タブのラベル",
      },
    ],
    examples: [],
    storybookUrls: [],
  },
];

const toComponentSlug = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/-{2,}/g, "-")
    .toLowerCase();

// Setup mock before tests
beforeAll(() => {
  vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockComponentsManifest));
});

describe("Components Tools", () => {
  describe("get-components", () => {
    // Define the input schema similar to how it's defined in the tool
    const inputSchema = {
      search: z
        .string()
        .optional()
        .describe("Optional search query to filter components by name"),
      category: z
        .enum(["Actions", "Inputs", "Layout", "Display", "Feedback"])
        .optional()
        .describe("Filter components by category"),
      limit: z
        .number()
        .optional()
        .describe("Maximum number of results to return (default: all)"),
    };

    describe("Input Schema Validation", () => {
      it("should accept valid search string", () => {
        expect(() => inputSchema.search.parse("Button")).not.toThrow();
        expect(() => inputSchema.search.parse("")).not.toThrow();
      });

      it("should accept valid category", () => {
        expect(() => inputSchema.category.parse("Actions")).not.toThrow();
        expect(() => inputSchema.category.parse("Inputs")).not.toThrow();
      });

      it("should accept valid limit number", () => {
        expect(() => inputSchema.limit.parse(10)).not.toThrow();
        expect(() => inputSchema.limit.parse(1)).not.toThrow();
      });

      it("should allow undefined values (optional)", () => {
        expect(inputSchema.search.parse(undefined)).toBeUndefined();
        expect(inputSchema.category.parse(undefined)).toBeUndefined();
        expect(inputSchema.limit.parse(undefined)).toBeUndefined();
      });

      it("should reject invalid types", () => {
        expect(() => inputSchema.search.parse(123)).toThrow();
        expect(() => inputSchema.category.parse("InvalidCategory")).toThrow();
        expect(() => inputSchema.limit.parse("10")).toThrow();
      });
    });

    describe("Search Functionality", () => {
      it("should filter components by search query", () => {
        const searchQuery = "Button";
        const filtered = mockComponentsManifest.filter(
          (component) =>
            component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            component.displayName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            component.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

        expect(filtered).toHaveLength(2);
        expect(filtered[0].name).toBe("Button");
        expect(filtered[1].name).toBe("Icon Button");
      });

      it("should perform case-insensitive search", () => {
        const searchQuery = "BUTTON";
        const filtered = mockComponentsManifest.filter(
          (component) =>
            component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            component.displayName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            component.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

        expect(filtered).toHaveLength(2);
      });

      it("should return all components when no search query", () => {
        const filtered = mockComponentsManifest.filter(() => true);
        expect(filtered).toHaveLength(9);
      });
    });

    describe("Category Filtering", () => {
      it("should filter components by category", () => {
        const filtered = mockComponentsManifest.filter(
          (component) => component.category === "Actions"
        );

        expect(filtered).toHaveLength(2);
        expect(filtered.every((c) => c.category === "Actions")).toBe(true);
      });

      it("should filter Layout category components correctly", () => {
        const filtered = mockComponentsManifest.filter(
          (component) => component.category === "Layout"
        );

        expect(filtered).toHaveLength(4); // Accordion, AccordionGroup, Tabs, TabItem
        expect(filtered.every((c) => c.category === "Layout")).toBe(true);
      });
    });

    describe("Limit Functionality", () => {
      it("should limit results when specified", () => {
        const limit = 2;
        const limited = mockComponentsManifest.slice(0, limit);

        expect(limited).toHaveLength(2);
      });

      it("should return all results when limit exceeds total", () => {
        const limit = 20;
        const limited = mockComponentsManifest.slice(0, limit);

        expect(limited).toHaveLength(9);
      });
    });

    describe("Expected Output Structure", () => {
      it("should return correct structure with all components", () => {
        const categories = [
          ...new Set(mockComponentsManifest.map((c) => c.category)),
        ];
        const expectedOutput = {
          total: mockComponentsManifest.length,
          filtered: mockComponentsManifest.length,
          returned: mockComponentsManifest.length,
          categories,
          components: mockComponentsManifest.map((component) => ({
            name: component.name,
            slug: toComponentSlug(component.name),
            displayName: component.displayName,
            description: component.description,
            category: component.category,
            relatedComponents: component.relatedComponents,
          })),
        };

        expect(expectedOutput).toHaveProperty("total", 9);
        expect(expectedOutput).toHaveProperty("filtered", 9);
        expect(expectedOutput).toHaveProperty("returned", 9);
        expect(expectedOutput).toHaveProperty("categories");
        expect(expectedOutput.categories).toContain("Actions");
        expect(expectedOutput.categories).toContain("Inputs");
        expect(expectedOutput.categories).toContain("Feedback");
      });

      it("should return correct component summary structure", () => {
        const component = mockComponentsManifest[0];
        const summary = {
          name: component.name,
          slug: toComponentSlug(component.name),
          displayName: component.displayName,
          description: component.description,
          category: component.category,
          relatedComponents: component.relatedComponents,
        };

        expect(summary).toHaveProperty("name");
        expect(summary).toHaveProperty("displayName");
        expect(summary).toHaveProperty("description");
        expect(summary).toHaveProperty("category");
        expect(summary).toHaveProperty("relatedComponents");
      });

      it("should pass schema validation for get-components response", () => {
        const response = {
          total: mockComponentsManifest.length,
          filtered: mockComponentsManifest.length,
          returned: mockComponentsManifest.length,
          categories: ["Actions", "Feedback", "Inputs", "Layout"],
          components: mockComponentsManifest.map((c) => ({
            name: c.name,
            slug: toComponentSlug(c.name),
            displayName: c.displayName,
            description: c.description,
            category: c.category,
            relatedComponents: c.relatedComponents,
          })),
        };

        expect(() => GetComponentsResponseSchema.parse(response)).not.toThrow();
      });
    });
  });

  describe("get-component-detail", () => {
    // Define the input schema
    const inputSchema = {
      name: z.string().describe("The name of the component to get details for"),
    };

    describe("Input Schema Validation", () => {
      it("should accept valid component name", () => {
        expect(() => inputSchema.name.parse("Button")).not.toThrow();
        expect(() => inputSchema.name.parse("Modal Dialog")).not.toThrow();
      });

      it("should reject invalid types", () => {
        expect(() => inputSchema.name.parse(123)).toThrow();
        expect(() => inputSchema.name.parse(null)).toThrow();
        expect(() => inputSchema.name.parse(undefined)).toThrow();
      });

      it("should require name parameter", () => {
        expect(() => inputSchema.name.parse(undefined)).toThrow();
      });
    });

    describe("Component Search", () => {
      it("should find component by exact name match", () => {
        const componentName = "Button";
        const found = mockComponentsManifest.find(
          (c) => c.name.toLowerCase() === componentName.toLowerCase()
        );

        expect(found).toBeDefined();
        expect(found?.name).toBe("Button");
      });

      it("should handle components with spaces in name", () => {
        const componentName = "Modal Dialog";
        const found = mockComponentsManifest.find(
          (c) => c.name.toLowerCase() === componentName.toLowerCase()
        );

        expect(found).toBeDefined();
        expect(found?.name).toBe("Modal Dialog");
      });

      it("should return undefined for non-existent component", () => {
        const componentName = "NonExistentComponent";
        const found = mockComponentsManifest.find(
          (c) => c.name.toLowerCase() === componentName.toLowerCase()
        );

        expect(found).toBeUndefined();
      });
    });

    describe("Expected Output Structure", () => {
      it("should return correct structure for existing component", () => {
        const component = mockComponentsManifest[0];
        const componentSlug = toComponentSlug(component.name);
        const exportName = component.name.replace(/\s+/g, "");
        const expectedOutput = {
          name: component.name,
          slug: componentSlug,
          exists: true,
          displayName: component.displayName,
          description: component.description,
          category: component.category,
          lastUpdated: component.lastUpdated,
          importStatement: `import { ${exportName} } from "@serendie/ui";`,
          documentationUrl: component.hasDocumentation
            ? `https://serendie.design/components/${componentSlug}`
            : null,
          props: component.props,
          examples: component.examples,
          storybookUrls: component.storybookUrls,
          relatedComponents: component.relatedComponents,
          usage: {
            basic: `<${exportName}>Content</${exportName}>`,
            withProps: `<${exportName} prop="value">Content</${exportName}>`,
          },
        };

        expect(expectedOutput).toHaveProperty("name", "Button");
        expect(expectedOutput).toHaveProperty("exists", true);
        expect(expectedOutput).toHaveProperty("displayName");
        expect(expectedOutput).toHaveProperty("description");
        expect(expectedOutput).toHaveProperty("category");
        expect(expectedOutput).toHaveProperty("lastUpdated");
        expect(expectedOutput).toHaveProperty("importStatement");
        expect(expectedOutput).toHaveProperty("props");
        expect(expectedOutput).toHaveProperty("examples");
        expect(expectedOutput).toHaveProperty("storybookUrls");
        expect(expectedOutput).toHaveProperty("relatedComponents");
        expect(expectedOutput).toHaveProperty("usage");
      });

      it("should return correct structure for non-existent component", () => {
        const componentName = "NonExistentComponent";
        const expectedOutput = {
          name: componentName,
          exists: false,
          message: `Component '${componentName}' not found in components manifest`,
        };

        expect(expectedOutput).toHaveProperty("name", componentName);
        expect(expectedOutput).toHaveProperty("exists", false);
        expect(expectedOutput).toHaveProperty("message");
      });

      it("should generate correct import statement", () => {
        const component = mockComponentsManifest[0];
        const importStatement = `import { ${component.name.replace(
          /\s+/g,
          ""
        )} } from "@serendie/ui";`;

        expect(importStatement).toBe(
          'import { Button } from "@serendie/ui";'
        );
      });

      it("should include props with correct structure", () => {
        const component = mockComponentsManifest[0];
        const prop = component.props[0];

        expect(prop).toHaveProperty("name");
        expect(prop).toHaveProperty("type");
        expect(prop).toHaveProperty("required");
        expect(typeof prop.required).toBe("boolean");
      });

      it("should include examples with correct structure", () => {
        const component = mockComponentsManifest[0];
        const example = component.examples[0];

        expect(example).toHaveProperty("title");
        expect(example).toHaveProperty("description");
        expect(example).toHaveProperty("code");
        expect(example).toHaveProperty("fileName");
        expect(example).toHaveProperty("language");
        expect(["tsx", "jsx"]).toContain(example.language);
      });

      it("should generate usage examples correctly", () => {
        const componentName = "Button";
        const usage = {
          basic: `<${componentName}>Content</${componentName}>`,
          withProps: `<${componentName} prop="value">Content</${componentName}>`,
        };

        expect(usage.basic).toContain("<Button>");
        expect(usage.basic).toContain("</Button>");
        expect(usage.withProps).toContain('prop="value"');
      });

      it("should include related components for Accordion", () => {
        const accordion = mockComponentsManifest.find(
          (c) => c.name === "Accordion"
        );
        expect(accordion).toBeDefined();
        expect(accordion?.relatedComponents).toEqual(["AccordionGroup"]);
      });

      it("should include related components for AccordionGroup", () => {
        const accordionGroup = mockComponentsManifest.find(
          (c) => c.name === "AccordionGroup"
        );
        expect(accordionGroup).toBeDefined();
        expect(accordionGroup?.relatedComponents).toEqual(["Accordion"]);
      });

      it("should include related components for Tabs and TabItem", () => {
        const tabs = mockComponentsManifest.find((c) => c.name === "Tabs");
        const tabItem = mockComponentsManifest.find(
          (c) => c.name === "TabItem"
        );

        expect(tabs).toBeDefined();
        expect(tabs?.relatedComponents).toEqual(["TabItem"]);

        expect(tabItem).toBeDefined();
        expect(tabItem?.relatedComponents).toEqual(["Tabs"]);
      });

      it("should have empty related components for standalone components", () => {
        const button = mockComponentsManifest.find((c) => c.name === "Button");
        const textField = mockComponentsManifest.find(
          (c) => c.name === "Text Field"
        );

        expect(button?.relatedComponents).toEqual([]);
        expect(textField?.relatedComponents).toEqual([]);
      });

      it("should pass schema validation for component detail response", () => {
        const component = mockComponentsManifest[0];
        const componentSlug = toComponentSlug(component.name);
        const exportName = component.name.replace(/\s+/g, "");
        const response = {
          name: component.name,
          slug: componentSlug,
          exists: true as const,
          displayName: component.displayName,
          description: component.description,
          category: component.category,
          lastUpdated: component.lastUpdated,
          documentationUrl: `https://serendie.design/components/${componentSlug}`,
          importStatement: `import { ${exportName} } from "@serendie/ui";`,
          props: component.props,
          examples: component.examples,
          storybookUrls: component.storybookUrls.map((url) => ({
            ...url,
            fullPath: `https://storybook.serendie.design${url.path}`,
          })),
          relatedComponents: component.relatedComponents,
          usage: {
            basic: `<${exportName}>Content</${exportName}>`,
            withProps: `<${exportName} styleType="value" size="value">Content</${exportName}>`,
          },
        };

        expect(() =>
          GetComponentDetailResponseSchema.parse(response)
        ).not.toThrow();
      });

      it("should pass schema validation for component not found response", () => {
        const response = {
          name: "NonExistentComponent",
          exists: false as const,
          message:
            "Component 'NonExistentComponent' not found in components manifest",
        };

        expect(() =>
          GetComponentDetailResponseSchema.parse(response)
        ).not.toThrow();
      });
    });
  });
});
