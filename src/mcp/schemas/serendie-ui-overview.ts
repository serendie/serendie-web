import { z } from "zod/v3";
import markdownContent from "./serendie-ui-overview.md?raw";

export const GetSerendieUIOverviewToolSchema = z.object({
  text: z
    .string()
    .describe(
      "Markdown content providing an overview of the @serendie/ui design system"
    ),
});

/**
 * Return Serendie UI overview content formatted in Markdown.
 */
export async function loadSerendieUIOverviewMarkdown(): Promise<string> {
  return markdownContent;
}

export const serendieUIOverviewMarkdown = markdownContent;
