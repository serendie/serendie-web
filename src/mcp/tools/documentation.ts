import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export function searchDocumentationTool(server: McpServer) {
  server.registerTool(
    "search-documentation",
    {
      title: "Search Documentation",
      description:
        "Search through Serendie documentation including components, design guidelines, and general documentation",
      inputSchema: {
        query: z
          .string()
          .describe("The search query to find in the documentation"),
        category: z
          .enum(["components", "pages", "all"])
          .optional()
          .describe("The category to search in (defaults to 'all')"),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of results to return (defaults to 10)"),
      },
    },
    async ({ query, category = "all", limit = 10 }) => {
      try {
        const results: Array<{
          type: string;
          path: string;
          title: string;
          description: string;
          excerpt: string;
          score: number;
        }> = [];

        const searchInDirectory = async (dir: string, type: string) => {
          try {
            const files = await fs.readdir(dir);

            for (const file of files) {
              if (!file.endsWith(".mdx")) continue;

              const filePath = path.join(dir, file);
              const content = await fs.readFile(filePath, "utf-8");
              const { data, content: mdxContent } = matter(content);

              // Calculate relevance score
              let score = 0;
              const lowerQuery = query.toLowerCase();
              const lowerTitle = (data.title || "").toLowerCase();
              const lowerDescription = (data.description || "").toLowerCase();
              const lowerContent = mdxContent.toLowerCase();

              // Title match (highest weight)
              if (lowerTitle.includes(lowerQuery)) {
                score += 10;
                if (lowerTitle === lowerQuery) score += 5;
              }

              // Description match
              if (lowerDescription.includes(lowerQuery)) {
                score += 5;
              }

              // Content match
              const contentMatches = (
                lowerContent.match(new RegExp(lowerQuery, "g")) || []
              ).length;
              score += Math.min(contentMatches, 10);

              if (score > 0) {
                // Extract excerpt around the first match
                const matchIndex = lowerContent.indexOf(lowerQuery);
                const excerptStart = Math.max(0, matchIndex - 100);
                const excerptEnd = Math.min(
                  mdxContent.length,
                  matchIndex + 100
                );
                let excerpt = mdxContent
                  .substring(excerptStart, excerptEnd)
                  .trim();

                // Clean up the excerpt
                if (excerptStart > 0) excerpt = "..." + excerpt;
                if (excerptEnd < mdxContent.length) excerpt = excerpt + "...";

                // Remove MDX/React imports and components from excerpt
                excerpt = excerpt.replace(
                  /import\s+.*?from\s+['"].*?['"];?\n?/g,
                  ""
                );
                excerpt = excerpt.replace(/<[^>]+>/g, "");

                results.push({
                  type,
                  path: file.replace(".mdx", ""),
                  title: data.title || file.replace(".mdx", ""),
                  description: data.description || "",
                  excerpt: excerpt.trim(),
                  score,
                });
              }
            }
          } catch (error) {
            console.error(`Error searching in ${dir}:`, error);
          }
        };

        // Search in components
        if (category === "components" || category === "all") {
          await searchInDirectory(
            path.join(process.cwd(), "src", "content", "components"),
            "component"
          );
        }

        // Search in pages
        if (category === "pages" || category === "all") {
          await searchInDirectory(
            path.join(process.cwd(), "src", "content", "pages"),
            "page"
          );
        }

        // Sort by relevance score and limit results
        const sortedResults = results
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);

        const response = {
          query,
          category,
          totalResults: sortedResults.length,
          results: sortedResults.map(({ score: _score, ...result }) => result),
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
          structuredContent: response,
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error searching documentation: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
      }
    }
  );
}
