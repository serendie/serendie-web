import type { APIRoute } from "astro";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { StreamableHTTPTransport } from "@hono/mcp";
import packageJson from "../../../package.json";
import { createMcpServer } from "../../mcp/server";

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

// Create MCP server instance outside the route handler
const mcpServer = createMcpServer();

// MCP endpoint
app.all("/mcp", async (c) => {
  const transport = new StreamableHTTPTransport();
  await mcpServer.connect(transport);
  return transport.handleRequest(c);
});

// 404 handler for API routes
app.notFound((c) => {
  return c.json({ error: "API endpoint not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("API Error:", err);
  console.error("Stack trace:", err.stack);
  return c.json({ 
    error: "Internal Server Error",
    message: err.message,
    // Include stack trace in development
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  }, 500);
});

// Export the app type for TypeScript support
export type App = typeof app;

// Astro API route handler
export const ALL: APIRoute = (context) => {
  return app.fetch(context.request);
};
