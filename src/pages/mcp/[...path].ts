import type { APIRoute } from "astro";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { StreamableHTTPTransport } from "@hono/mcp";
import { createMcpServer } from "../../mcp/server";
import {
  setWorkerBindings,
  type WorkerBindings,
} from "../../mcp/utils/bindings";

// Disable prerendering for API routes
export const prerender = false;

// Create a new Hono instance with base path
const app = new Hono().basePath("/mcp");

// Add CORS middleware (you can configure this as needed)
app.use("*", cors());

// MCP endpoint
app.all("/", async (c) => {
  const workerEnv = c.env as WorkerBindings | undefined;
  if (workerEnv) {
    setWorkerBindings(workerEnv);
  }

  const mcpServer = createMcpServer();
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
  const cfEnv = (
    context.locals as { runtime?: { env?: WorkerBindings } }
  )?.runtime?.env;

  if (cfEnv) {
    setWorkerBindings(cfEnv);
  }

  return app.fetch(context.request, cfEnv);
};
