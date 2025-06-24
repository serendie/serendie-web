import { describe, it, expect, vi, beforeAll } from "vitest";
import { z } from "zod";
import { readFile } from "fs/promises";
import {
  GetComponentsResponseSchema,
  GetComponentDetailResponseSchema,
} from "../schemas/components";

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
    props: [],
    examples: [],
    storybookUrls: [],
  },
];

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
        expect(filtered).toHaveLength(5);
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

      it("should return empty array for category with no components", () => {
        const filtered = mockComponentsManifest.filter(
          (component) => component.category === "Layout"
        );

        expect(filtered).toHaveLength(0);
      });
    });

    describe("Limit Functionality", () => {
      it("should limit results when specified", () => {
        const limit = 2;
        const limited = mockComponentsManifest.slice(0, limit);

        expect(limited).toHaveLength(2);
      });

      it("should return all results when limit exceeds total", () => {
        const limit = 10;
        const limited = mockComponentsManifest.slice(0, limit);

        expect(limited).toHaveLength(5);
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
            displayName: component.displayName,
            description: component.description,
            category: component.category,
          })),
        };

        expect(expectedOutput).toHaveProperty("total", 5);
        expect(expectedOutput).toHaveProperty("filtered", 5);
        expect(expectedOutput).toHaveProperty("returned", 5);
        expect(expectedOutput).toHaveProperty("categories");
        expect(expectedOutput.categories).toContain("Actions");
        expect(expectedOutput.categories).toContain("Inputs");
        expect(expectedOutput.categories).toContain("Feedback");
      });

      it("should return correct component summary structure", () => {
        const component = mockComponentsManifest[0];
        const summary = {
          name: component.name,
          displayName: component.displayName,
          description: component.description,
          category: component.category,
        };

        expect(summary).toHaveProperty("name");
        expect(summary).toHaveProperty("displayName");
        expect(summary).toHaveProperty("description");
        expect(summary).toHaveProperty("category");
      });

      it("should pass schema validation for get-components response", () => {
        const response = {
          total: mockComponentsManifest.length,
          filtered: mockComponentsManifest.length,
          returned: mockComponentsManifest.length,
          categories: ["Actions", "Inputs", "Feedback"],
          components: mockComponentsManifest.map((c) => ({
            name: c.name,
            displayName: c.displayName,
            description: c.description,
            category: c.category,
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
        const expectedOutput = {
          name: component.name,
          exists: true,
          displayName: component.displayName,
          description: component.description,
          category: component.category,
          lastUpdated: component.lastUpdated,
          importStatement: `import { ${component.name} } from "@serendie/ui/${component.name
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase()
            .replace(/^-/, "")}";`,
          documentationUrl: component.hasDocumentation
            ? `https://serendie.design/components/${component.name
                .replace(/([A-Z])/g, "-$1")
                .toLowerCase()
                .replace(/^-/, "")}`
            : null,
          props: component.props,
          examples: component.examples,
          storybookUrls: component.storybookUrls,
          usage: {
            basic: `<${component.name}>Content</${component.name}>`,
            withProps: `<${component.name} prop="value">Content</${component.name}>`,
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
        const importStatement = `import { ${component.name} } from "@serendie/ui/${component.name
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()
          .replace(/^-/, "")}";`;

        expect(importStatement).toBe(
          'import { Button } from "@serendie/ui/button";'
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

      it("should pass schema validation for component detail response", () => {
        const component = mockComponentsManifest[0];
        const response = {
          name: component.name,
          exists: true as const,
          displayName: component.displayName,
          description: component.description,
          category: component.category,
          lastUpdated: component.lastUpdated,
          documentationUrl: `https://serendie.design/components/${component.name.toLowerCase()}`,
          importStatement: `import { ${component.name} } from "@serendie/ui/${component.name.toLowerCase()}";`,
          props: component.props,
          examples: component.examples,
          storybookUrls: component.storybookUrls.map((url) => ({
            ...url,
            fullPath: `https://storybook.serendie.design${url.path}`,
          })),
          usage: {
            basic: `<${component.name}>Content</${component.name}>`,
            withProps: `<${component.name} styleType="value" size="value">Content</${component.name}>`,
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
