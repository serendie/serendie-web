import type { APIRoute } from "astro";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { StreamableHTTPTransport } from "@hono/mcp";
import { createMcpServer } from "../../mcp/server";

// Disable prerendering for API routes
export const prerender = false;

// Create a new Hono instance with base path
const app = new Hono().basePath("/mcp");

// Add CORS middleware (you can configure this as needed)
app.use("*", cors());

// Create MCP server instance outside the route handler
const mcpServer = createMcpServer();

// MCP endpoint
app.all("/", async (c) => {
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
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
      // Include stack trace in development
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
    500
  );
});

// Export the app type for TypeScript support
export type App = typeof app;

// Astro API route handler
export const ALL: APIRoute = (context) => {
  return app.fetch(context.request);
};
