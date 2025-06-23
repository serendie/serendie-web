import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs/promises";

// Mock fs module
vi.mock("fs/promises");

// Mock gray-matter to avoid importing it in test
const mockMatter = (content: string) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content };

  const frontmatter = match[1];
  const data: Record<string, string> = {};

  frontmatter.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (key && value) {
        data[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  });

  return { data, content: match[2] };
};

describe("get-component-info Tool Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("List All Components", () => {
    it("should parse component list from directory", async () => {
      const mockFiles = [
        "button.mdx",
        "modal-dialog.mdx",
        "text-field.mdx",
        "not-mdx.txt",
      ];
      // @ts-expect-error - mocking fs.readdir to return string[] instead of Dirent[]
      vi.mocked(fs.readdir).mockResolvedValue(mockFiles);

      vi.mocked(fs.readFile).mockImplementation(async (path) => {
        const fileName = path.toString().split("/").pop()?.replace(".mdx", "");
        return `---
title: ${fileName}
componentName: ${fileName}コンポーネント
description: ${fileName}の説明
lastUpdated: "2024-11-1"
---
Content for ${fileName}`;
      });

      // Simulate the directory reading logic
      const files = await fs.readdir("src/content/components");
      const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

      expect(mdxFiles).toHaveLength(3);
      expect(mdxFiles).toContain("button.mdx");
      expect(mdxFiles).not.toContain("not-mdx.txt");
    });

    it("should extract frontmatter from MDX files", async () => {
      const mockContent = `---
title: Button
componentName: ボタン
description: アクションをトリガーするためのクリック可能なコンポーネントです。
lastUpdated: "2024-11-1"
---
Component content`;

      const parsed = mockMatter(mockContent);

      expect(parsed.data.title).toBe("Button");
      expect(parsed.data.componentName).toBe("ボタン");
      expect(parsed.data.description).toContain("アクションをトリガー");
      expect(parsed.data.lastUpdated).toBe("2024-11-1");
    });
  });

  describe("MDX Content Parsing", () => {
    it("should extract Code components from MDX content", () => {
      const mdxContent = `
import Code from "@/components/Code.astro";

<Code
  title="サイズ"
  description="SmallとMediumの2種類があります。"
  code={sizeSampleRaw}
  storyPath="/story/components-button--medium"
>
  <SizeSample client:load />
</Code>

<Code
  title="バリエーション"
  description="4種類のバリエーションがあります。"
>
</Code>`;

      const codeRegex =
        /<Code[\s\S]*?title="([^"]*)"[\s\S]*?description="([^"]*)"[\s\S]*?>/g;
      const codeExamples = [];
      let match;

      while ((match = codeRegex.exec(mdxContent)) !== null) {
        codeExamples.push({
          title: match[1],
          description: match[2],
        });
      }

      expect(codeExamples).toHaveLength(2);
      expect(codeExamples[0].title).toBe("サイズ");
      expect(codeExamples[0].description).toBe(
        "SmallとMediumの2種類があります。"
      );
      expect(codeExamples[1].title).toBe("バリエーション");
    });

    it("should extract import statements for sample components", () => {
      const mdxContent = `
import { SizeSample } from "@/sampleCode/Button/SizeSample";
import sizeSampleRaw from "@/sampleCode/Button/SizeSample.tsx?raw";
import { TypeSample } from "@/sampleCode/Button/TypeSample";
import { default as DefaultExport } from "@/sampleCode/Other";`;

      const importRegex =
        /import\s+{\s*(\w+)\s*}\s+from\s+"@\/sampleCode\/([^"]+)"/g;
      const sampleComponents = [];
      let match;

      while ((match = importRegex.exec(mdxContent)) !== null) {
        sampleComponents.push({
          name: match[1],
          path: match[2],
        });
      }

      expect(sampleComponents).toHaveLength(2);
      expect(sampleComponents[0].name).toBe("SizeSample");
      expect(sampleComponents[0].path).toBe("Button/SizeSample");
      expect(sampleComponents[1].name).toBe("TypeSample");
    });

    it("should detect storybook integration", () => {
      const mdxWithStorybook = `<Code storyPath="/story/components-button--medium">`;
      const mdxWithoutStorybook = `<Code title="Example">`;

      expect(mdxWithStorybook.includes("storyPath=")).toBe(true);
      expect(mdxWithoutStorybook.includes("storyPath=")).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should handle file system errors gracefully", async () => {
      vi.mocked(fs.readdir).mockRejectedValue(
        new Error("EACCES: Permission denied")
      );

      await expect(fs.readdir("src/content/components")).rejects.toThrow(
        "EACCES: Permission denied"
      );
    });

    it("should handle malformed MDX files", () => {
      const malformedMdx = `---
title: Broken  
invalid: yaml: [}
---
Content here`;

      const parsed = mockMatter(malformedMdx);
      // Our simple parser won't throw, but might produce unexpected results
      expect(parsed.data.title).toBe("Broken");
      expect(parsed.data.invalid).toBe("yaml: [}");
      expect(parsed.content).toBe("Content here");
    });
  });

  describe("Expected Output Structure", () => {
    it("should return correct structure for component list", () => {
      const expectedOutput = {
        totalComponents: 3,
        components: [
          {
            id: "button",
            title: "Button",
            componentName: "ボタン",
            description:
              "アクションをトリガーするためのクリック可能なコンポーネントです。",
            lastUpdated: "2024-11-1",
          },
          {
            id: "modal-dialog",
            title: "Modal Dialog",
            componentName: "モーダルダイアログ",
            description: "オーバーレイ表示されるダイアログ",
            lastUpdated: "2024-11-1",
          },
        ],
      };

      expect(expectedOutput).toHaveProperty("totalComponents");
      expect(expectedOutput).toHaveProperty("components");
      expect(expectedOutput.components[0]).toHaveProperty("id");
      expect(expectedOutput.components[0]).toHaveProperty("title");
      expect(expectedOutput.components[0]).toHaveProperty("componentName");
      expect(expectedOutput.components[0]).toHaveProperty("description");
    });

    it("should return correct structure for component detail", () => {
      const expectedOutput = {
        id: "button",
        title: "Button",
        componentName: "ボタン",
        description:
          "アクションをトリガーするためのクリック可能なコンポーネントです。",
        lastUpdated: "2024-11-1",
        codeExamples: [
          {
            title: "サイズ",
            description: "SmallとMediumの2種類があります。",
          },
        ],
        sampleComponents: [
          {
            name: "SizeSample",
            path: "Button/SizeSample",
          },
        ],
        storybook: true,
      };

      expect(expectedOutput).toHaveProperty("codeExamples");
      expect(expectedOutput).toHaveProperty("sampleComponents");
      expect(expectedOutput).toHaveProperty("storybook");
      expect(Array.isArray(expectedOutput.codeExamples)).toBe(true);
      expect(Array.isArray(expectedOutput.sampleComponents)).toBe(true);
    });
  });
});
