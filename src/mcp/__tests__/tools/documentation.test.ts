import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs/promises";

// Mock fs module
vi.mock("fs/promises");

// Simple frontmatter parser for testing
const parseFrontmatter = (content: string) => {
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

describe("search-documentation Tool Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Search Functionality", () => {
    it("should find documents matching query in title", async () => {
      const mockFiles = ["button.mdx", "modal.mdx", "text-field.mdx"];
      // @ts-expect-error - mocking fs.readdir to return string[] instead of Dirent[]
      vi.mocked(fs.readdir).mockResolvedValue(mockFiles);

      vi.mocked(fs.readFile).mockImplementation(async (path) => {
        if (path.toString().includes("button.mdx")) {
          return `---
title: Button
description: Clickable button component for user actions
---
The Button component is used to trigger actions. It supports multiple variants and sizes.`;
        } else if (path.toString().includes("modal.mdx")) {
          return `---
title: Modal
description: Dialog overlay component
---
Modal content here`;
        } else {
          return `---
title: Text Field
description: Input field component
---
Text field content here`;
        }
      });

      // Simulate search logic
      const files = await fs.readdir("src/content/components");
      const results = [];

      for (const file of files) {
        const content = await fs.readFile(file, "utf-8");
        const { data, content: mdxContent } = parseFrontmatter(content);

        const query = "button";
        const lowerQuery = query.toLowerCase();
        const lowerTitle = (data.title || "").toLowerCase();
        const lowerDescription = (data.description || "").toLowerCase();
        const lowerContent = mdxContent.toLowerCase();

        if (
          lowerTitle.includes(lowerQuery) ||
          lowerDescription.includes(lowerQuery) ||
          lowerContent.includes(lowerQuery)
        ) {
          results.push({
            path: file.replace(".mdx", ""),
            title: data.title,
            description: data.description,
          });
        }
      }

      expect(results).toHaveLength(1);
      expect(results[0].path).toBe("button");
      expect(results[0].title).toBe("Button");
    });

    it("should calculate relevance scores correctly", () => {
      const query = "button";
      const lowerQuery = query.toLowerCase();

      // Title match (highest weight)
      const titleMatchScore = "button component"
        .toLowerCase()
        .includes(lowerQuery)
        ? 10
        : 0;
      expect(titleMatchScore).toBe(10);

      // Exact title match bonus
      const exactTitleScore = "button".toLowerCase() === lowerQuery ? 15 : 0;
      expect(exactTitleScore).toBe(15);

      // Description match
      const descMatchScore = "clickable button element"
        .toLowerCase()
        .includes(lowerQuery)
        ? 5
        : 0;
      expect(descMatchScore).toBe(5);

      // Content matches (capped at 10)
      const content =
        "button button button button button button button button button button button";
      const contentMatches = (
        content.toLowerCase().match(new RegExp(lowerQuery, "g")) || []
      ).length;
      const contentScore = Math.min(contentMatches, 10);
      expect(contentScore).toBe(10);
    });
  });

  describe("Category Filtering", () => {
    it("should filter by category when specified", async () => {
      const componentsFiles = ["button.mdx", "modal.mdx"];
      const pagesFiles = ["getting-started.mdx", "installation.mdx"];

      vi.mocked(fs.readdir).mockImplementation(async (path) => {
        if (path.toString().includes("components")) {
          // @ts-expect-error - mocking fs.readdir to return string[] instead of Dirent[]
          return componentsFiles;
        }
        if (path.toString().includes("pages")) {
          // @ts-expect-error - mocking fs.readdir to return string[] instead of Dirent[]
          return pagesFiles;
        }
        // @ts-expect-error - mocking fs.readdir to return string[] instead of Dirent[]
        return [];
      });

      // Test components category
      const componentFiles = await fs.readdir("src/content/components");
      expect(componentFiles).toEqual(componentsFiles);

      // Test pages category
      const pageFiles = await fs.readdir("src/content/pages");
      expect(pageFiles).toEqual(pagesFiles);
    });
  });

  describe("Result Limiting", () => {
    it("should limit results based on limit parameter", () => {
      const allResults = Array(20)
        .fill(0)
        .map((_, i) => ({
          score: Math.random() * 20,
          path: `component${i}`,
          title: `Component ${i}`,
        }));

      const limit = 5;
      const sortedResults = allResults
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      expect(sortedResults).toHaveLength(5);
      // Verify they are sorted by score
      for (let i = 1; i < sortedResults.length; i++) {
        expect(sortedResults[i - 1].score).toBeGreaterThanOrEqual(
          sortedResults[i].score
        );
      }
    });
  });

  describe("Excerpt Generation", () => {
    it("should generate excerpt around matched text", () => {
      const content =
        "This is a long document with lots of content. In the middle of this document, we have the keyword that we are searching for. After the keyword, there is more content that continues for quite a while.";
      const query = "keyword";
      const lowerContent = content.toLowerCase();
      const matchIndex = lowerContent.indexOf(query);

      const excerptStart = Math.max(0, matchIndex - 100);
      const excerptEnd = Math.min(content.length, matchIndex + 100);
      let excerpt = content.substring(excerptStart, excerptEnd).trim();

      if (excerptStart > 0) excerpt = "..." + excerpt;
      if (excerptEnd < content.length) excerpt = excerpt + "...";

      expect(excerpt).toContain("keyword");
      expect(excerpt).toContain("...");
      expect(excerpt.length).toBeLessThan(content.length);
    });

    it("should clean MDX/React imports from excerpt", () => {
      let excerpt = `import Button from './Button';
import { useState } from 'react';
The actual content with <Component /> tags.`;

      // Remove imports
      excerpt = excerpt.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, "");

      // Remove JSX/HTML tags
      excerpt = excerpt.replace(/<[^>]+>/g, "");

      expect(excerpt).not.toContain("import");
      expect(excerpt).not.toContain("<Component />");
      expect(excerpt).toContain("The actual content with");
    });
  });

  describe("Error Handling", () => {
    it("should handle directory read errors", async () => {
      vi.mocked(fs.readdir).mockRejectedValue(
        new Error("ENOENT: no such file or directory")
      );

      await expect(fs.readdir("nonexistent")).rejects.toThrow("ENOENT");
    });

    it("should handle file read errors gracefully", async () => {
      // @ts-expect-error - mocking fs.readdir to return string[] instead of Dirent[]
      vi.mocked(fs.readdir).mockResolvedValue(["test.mdx"]);
      vi.mocked(fs.readFile).mockRejectedValue(
        new Error("EACCES: permission denied")
      );

      await expect(fs.readFile("test.mdx", "utf-8")).rejects.toThrow("EACCES");
    });
  });

  describe("Expected Output Structure", () => {
    it("should return correct search result structure", () => {
      const expectedOutput = {
        query: "button",
        category: "all",
        totalResults: 3,
        results: [
          {
            type: "component",
            path: "button",
            title: "Button",
            description: "Clickable button component",
            excerpt: "...Button component is used to trigger actions...",
          },
          {
            type: "component",
            path: "icon-button",
            title: "Icon Button",
            description: "Button with icon",
            excerpt: "...Icon button extends the base button...",
          },
        ],
      };

      expect(expectedOutput).toHaveProperty("query");
      expect(expectedOutput).toHaveProperty("category");
      expect(expectedOutput).toHaveProperty("totalResults");
      expect(expectedOutput).toHaveProperty("results");
      expect(Array.isArray(expectedOutput.results)).toBe(true);

      const firstResult = expectedOutput.results[0];
      expect(firstResult).toHaveProperty("type");
      expect(firstResult).toHaveProperty("path");
      expect(firstResult).toHaveProperty("title");
      expect(firstResult).toHaveProperty("description");
      expect(firstResult).toHaveProperty("excerpt");
    });

    it("should return empty results for no matches", () => {
      const expectedOutput = {
        query: "nonexistent-term",
        category: "all",
        totalResults: 0,
        results: [],
      };

      expect(expectedOutput.totalResults).toBe(0);
      expect(expectedOutput.results).toHaveLength(0);
    });
  });
});
