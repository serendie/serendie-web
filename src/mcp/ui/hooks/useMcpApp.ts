import { useState, useCallback } from "react";
import {
  useApp,
  App,
  McpUiToolResultNotification,
} from "@modelcontextprotocol/ext-apps/react";

// Re-export useApp for direct usage
export { useApp };

// MCP Apps tool result content item
interface ToolResultContentItem {
  type: string;
  text?: string;
}

/**
 * Hook to use MCP Apps SDK with tool result handling
 * Wraps the official useApp hook with convenient tool result state
 */
export function useMcpAppWithToolResult<T = unknown>() {
  const [toolResult, setToolResult] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { app, isConnected, error } = useApp({
    appInfo: { name: "Serendie Component Preview", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app: App) => {
      // Handle tool result notifications
      app.ontoolresult = (
        params: McpUiToolResultNotification["params"]
      ) => {
        console.log("[MCP Apps] Tool result received:", params);

        // Parse the text content as JSON if available
        const textContent = params.content?.find(
          (c: ToolResultContentItem) => c.type === "text"
        );
        if (textContent && "text" in textContent) {
          try {
            const parsed = JSON.parse(textContent.text as string);
            setToolResult(parsed as T);
          } catch {
            // If not JSON, use the raw text
            setToolResult(textContent.text as T);
          }
        }
        setIsLoading(false);
      };
    },
  });

  // Call a tool on the server
  const callServerTool = useCallback(
    async (name: string, args: Record<string, unknown> = {}) => {
      if (!app) {
        throw new Error("App not connected");
      }
      try {
        const result = await app.callServerTool({ name, arguments: args });
        console.log("[MCP Apps] Tool call result:", result);
        return result;
      } catch (error) {
        console.error("[MCP Apps] Tool call failed:", error);
        throw error;
      }
    },
    [app]
  );

  return {
    app,
    toolResult,
    isConnected,
    isLoading: !isConnected || isLoading,
    error,
    callServerTool,
  };
}

/**
 * Convenience hook to get component name from tool result
 */
export function useComponentFromToolResult() {
  const { app, toolResult, isLoading, callServerTool, error } =
    useMcpAppWithToolResult<{
      name?: string;
      componentName?: string;
    }>();

  const componentName = toolResult?.name || toolResult?.componentName || null;

  return {
    app,
    componentName,
    isLoading,
    error,
    callServerTool,
  };
}
