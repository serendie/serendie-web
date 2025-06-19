import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

function cleanContent(content: string): string {
  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---\n/, "");

  // Remove import statements
  content = content.replace(/^import\s+.*?;?\s*$/gm, "");

  // Extract Code component information
  const codeBlocks = [];
  const codeRegex =
    /<Code[^>]*?title="([^"]*)"[^>]*?description="([^"]*)"[^>]*?>[\s\S]*?<\/Code>/g;
  let match;
  while ((match = codeRegex.exec(content)) !== null) {
    const title = match[1];
    const description = match[2];
    codeBlocks.push(`### ${title}\n\n${description}`);
  }

  // Remove all JSX/MDX components
  content = content.replace(
    /<[A-Z][A-Za-z0-9]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g,
    ""
  );
  content = content.replace(/<[A-Z][A-Za-z0-9]*[^>]*\/>/g, "");

  // Remove export statements
  content = content.replace(/^export\s+.*?;?\s*$/gm, "");

  // Add extracted code blocks at the end
  if (codeBlocks.length > 0) {
    content = content.trim() + "\n\n" + codeBlocks.join("\n\n");
  }

  // Clean up multiple newlines
  content = content.replace(/\n{3,}/g, "\n\n");

  return content.trim();
}

function formatPagePath(slug: string): string {
  // Convert slug to URL path
  return `/${slug.replace("/00_index", "").replace("00_", "")}`;
}

export const GET: APIRoute = async () => {
  const baseUrl = "https://serendie.design";

  // Fetch all content
  const pages = await getCollection("pages");
  const components = await getCollection("components");

  // Sort pages by directory structure and filename
  const sortedPages = pages.sort((a, b) => a.id.localeCompare(b.id));
  const sortedComponents = components.sort((a, b) =>
    a.data.title.localeCompare(b.data.title)
  );

  // For MDX content, we'll use the raw body property
  const pagesWithBody = sortedPages;
  const componentsWithBody = sortedComponents;

  // Build the llms-full.txt content
  const content = [];

  // Header
  content.push("# Serendie Design System - Full Documentation");
  content.push("");
  content.push(
    "> Complete documentation for the Serendie Design System, including all content details. Created with support from Takram Japan Inc. and protected as intellectual property of Mitsubishi Electric Corporation."
  );
  content.push("");

  // Group pages by directory
  const pagesByDir: Record<string, typeof pagesWithBody> = {};
  pagesWithBody.forEach((page) => {
    const dir = page.id.split("/")[0];
    if (!pagesByDir[dir]) pagesByDir[dir] = [];
    pagesByDir[dir].push(page);
  });

  // Table of contents
  content.push("## Table of Contents");
  content.push("");

  // About TOC
  if (pagesByDir["about"]) {
    content.push("### About");
    pagesByDir["about"].forEach((page) => {
      content.push(`- ${page.data.title}`);
    });
    content.push("");
  }

  // Get Started TOC
  if (pagesByDir["get-started"]) {
    content.push("### Get Started");
    pagesByDir["get-started"].forEach((page) => {
      content.push(`- ${page.data.title}`);
    });
    content.push("");
  }

  // Foundations TOC
  if (pagesByDir["foundations"]) {
    content.push("### Foundations");
    pagesByDir["foundations"].forEach((page) => {
      content.push(`- ${page.data.title}`);
    });
    content.push("");
  }

  // Components TOC
  content.push("### Components");
  componentsWithBody.forEach((component) => {
    content.push(`- ${component.data.title}`);
  });
  content.push("");

  // Terms TOC
  if (pagesByDir["terms"]) {
    content.push("### Terms");
    pagesByDir["terms"].forEach((page) => {
      content.push(`- ${page.data.title}`);
    });
    content.push("");
  }

  content.push("---");
  content.push("");

  // Full content sections
  content.push("## Full Documentation Content");
  content.push("");

  // About full content
  if (pagesByDir["about"]) {
    content.push("### About");
    content.push("");
    pagesByDir["about"].forEach((page) => {
      const path = formatPagePath(page.slug);
      content.push(`#### ${page.data.title}`);
      content.push(`URL: ${baseUrl}${path}`);
      content.push("");
      const cleanedContent = cleanContent(page.body);
      if (cleanedContent) {
        content.push(cleanedContent);
        content.push("");
      }
      content.push("---");
      content.push("");
    });
  }

  // Get Started full content
  if (pagesByDir["get-started"]) {
    content.push("### Get Started");
    content.push("");
    pagesByDir["get-started"].forEach((page) => {
      const path = formatPagePath(page.slug);
      content.push(`#### ${page.data.title}`);
      content.push(`URL: ${baseUrl}${path}`);
      content.push("");
      const cleanedContent = cleanContent(page.body);
      if (cleanedContent) {
        content.push(cleanedContent);
        content.push("");
      }
      content.push("---");
      content.push("");
    });
  }

  // Foundations full content
  if (pagesByDir["foundations"]) {
    content.push("### Foundations");
    content.push("");
    pagesByDir["foundations"].forEach((page) => {
      const path = formatPagePath(page.slug);
      content.push(`#### ${page.data.title}`);
      content.push(`URL: ${baseUrl}${path}`);
      content.push("");
      const cleanedContent = cleanContent(page.body);
      if (cleanedContent) {
        content.push(cleanedContent);
        content.push("");
      }
      content.push("---");
      content.push("");
    });
  }

  // Components full content
  content.push("### Components");
  content.push("");
  componentsWithBody.forEach((component) => {
    const path = `/components/${component.slug}`;
    content.push(`#### ${component.data.title}`);
    content.push(`URL: ${baseUrl}${path}`);
    content.push(`Component Name: ${component.data.componentName}`);
    content.push(`Description: ${component.data.description}`);
    if (component.data.lastUpdated) {
      content.push(`Last Updated: ${component.data.lastUpdated}`);
    }
    content.push("");
    const cleanedContent = cleanContent(component.body);
    if (cleanedContent) {
      content.push(cleanedContent);
      content.push("");
    }
    content.push("---");
    content.push("");
  });

  // Terms full content
  if (pagesByDir["terms"]) {
    content.push("### Terms");
    content.push("");
    pagesByDir["terms"].forEach((page) => {
      const path = formatPagePath(page.slug);
      content.push(`#### ${page.data.title}`);
      content.push(`URL: ${baseUrl}${path}`);
      content.push("");
      const cleanedContent = cleanContent(page.body);
      if (cleanedContent) {
        content.push(cleanedContent);
        content.push("");
      }
    });
  }

  return new Response(content.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
