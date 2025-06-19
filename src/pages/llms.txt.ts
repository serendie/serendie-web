import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

function cleanContent(content: string): string {
  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---\n/, "");

  // Remove import statements
  content = content.replace(/^import\s+.*?;?\s*$/gm, "");

  // Remove React/MDX components (basic pattern)
  content = content.replace(
    /<[A-Z][A-Za-z0-9]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g,
    ""
  );
  content = content.replace(/<[A-Z][A-Za-z0-9]*[^>]*\/>/g, "");

  // Remove export statements
  content = content.replace(/^export\s+.*?;?\s*$/gm, "");

  // Clean up multiple newlines
  content = content.replace(/\n{3,}/g, "\n\n");

  return content.trim();
}

function formatPagePath(slug: string): string {
  // Convert slug to URL path
  return `/${slug.replace("/00_index", "").replace("00_", "")}`;
}

export const GET: APIRoute = async () => {
  const baseUrl = "https://serendie.com"; // Update with actual domain

  // Fetch all content
  const pages = await getCollection("pages");
  const components = await getCollection("components");

  // Sort pages by directory structure and filename
  const sortedPages = pages.sort((a, b) => a.id.localeCompare(b.id));
  const sortedComponents = components.sort((a, b) =>
    a.data.title.localeCompare(b.data.title)
  );

  // Build the llms.txt content
  const content = [];

  // Header
  content.push("# Serendie Design System");
  content.push("");
  content.push(
    "> A comprehensive design system documentation for building consistent and accessible user interfaces. Created with support from Takram Japan Inc. and protected as intellectual property of Mitsubishi Electric Corporation."
  );
  content.push("");

  // Group pages by directory
  const pagesByDir: Record<string, typeof pages> = {};
  sortedPages.forEach((page) => {
    const dir = page.id.split("/")[0];
    if (!pagesByDir[dir]) pagesByDir[dir] = [];
    pagesByDir[dir].push(page);
  });

  // About section
  if (pagesByDir["about"]) {
    content.push("## About");
    content.push("");
    pagesByDir["about"].forEach((page) => {
      const path = formatPagePath(page.slug);
      const description = page.data.description || "About this design system";
      content.push(`- [${page.data.title}](${baseUrl}${path}): ${description}`);
    });
    content.push("");
  }

  // Get Started section
  if (pagesByDir["get-started"]) {
    content.push("## Get Started");
    content.push("");
    pagesByDir["get-started"].forEach((page) => {
      const path = formatPagePath(page.slug);
      const description = page.data.description || "Getting started guide";
      content.push(`- [${page.data.title}](${baseUrl}${path}): ${description}`);
    });
    content.push("");
  }

  // Foundations section
  if (pagesByDir["foundations"]) {
    content.push("## Foundations");
    content.push("");
    pagesByDir["foundations"].forEach((page) => {
      const path = formatPagePath(page.slug);
      const description =
        page.data.description ||
        cleanContent(page.body).split("\n")[0].substring(0, 100);
      content.push(`- [${page.data.title}](${baseUrl}${path}): ${description}`);
    });
    content.push("");
  }

  // Components section
  content.push("## Components");
  content.push("");
  sortedComponents.forEach((component) => {
    const path = `/components/${component.slug}`;
    content.push(
      `- [${component.data.title}](${baseUrl}${path}): ${component.data.description}`
    );
  });
  content.push("");

  // Terms section
  if (pagesByDir["terms"]) {
    content.push("## Terms");
    content.push("");
    pagesByDir["terms"].forEach((page) => {
      const path = formatPagePath(page.slug);
      const description =
        page.data.description || "Terms of use and licensing information";
      content.push(`- [${page.data.title}](${baseUrl}${path}): ${description}`);
    });
    content.push("");
  }

  // Reference to full documentation
  content.push("## Full Documentation");
  content.push("");
  content.push(
    "For complete documentation content including all details, visit: " +
      `${baseUrl}/llms-full.txt`
  );
  content.push("");

  return new Response(content.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
