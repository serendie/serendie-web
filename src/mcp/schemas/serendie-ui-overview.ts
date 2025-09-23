import markdownContent from "./serendie-ui-overview.md?raw";

/**
 * Return Serendie UI overview content formatted in Markdown.
 */
export async function loadSerendieUIOverviewMarkdown(): Promise<string> {
  return markdownContent;
}

export const serendieUIOverviewMarkdown = markdownContent;
