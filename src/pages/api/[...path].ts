import type { APIRoute } from "astro";
import { Hono } from "hono";
import { cors } from "hono/cors";
import packageJson from "../../../package.json";

// Disable prerendering for API routes
export const prerender = false;

// Create a new Hono instance with base path
const app = new Hono().basePath("/api/");

// Add CORS middleware (you can configure this as needed)
app.use("*", cors());

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Version endpoint
app.get("/version", (c) => {
  return c.json({
    version: packageJson.version,
    name: packageJson.name,
  });
});

// Example endpoint for getting component metadata
app.get("/components", (c) => {
  // This is just an example - you could fetch actual component data here
  return c.json({
    components: [
      { id: "button", name: "Button", category: "actions" },
      { id: "card", name: "Card", category: "layout" },
      { id: "input", name: "Input", category: "form" },
    ],
  });
});

// Example endpoint with parameters
app.get("/components/:id", (c) => {
  const id = c.req.param("id");

  // Mock response - replace with actual data fetching
  return c.json({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    description: `Component details for ${id}`,
    props: [],
  });
});

// 404 handler for API routes
app.notFound((c) => {
  return c.json({ error: "API endpoint not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: "Internal Server Error" }, 500);
});

// Export the app type for TypeScript support
export type App = typeof app;

// Astro API route handler
export const ALL: APIRoute = (context) => {
  return app.fetch(context.request);
};
