import fs from "fs/promises";
import path from "path";

interface ToolCallParams {
  name: string;
  arguments: Record<string, unknown>;
}

interface MCPRequest {
  jsonrpc: string;
  method: string;
  params?: ToolCallParams | Record<string, never>;
  id: number;
}

interface MCPResponse {
  jsonrpc: string;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: number;
}

// Get port from command line argument or use default
const PORT = process.argv[2] || "4321";
const MCP_URL = `http://localhost:${PORT}/api/mcp`;

// Output directory for test results
const OUTPUT_DIR = path.join(process.cwd(), "src/mcp/__tests__/outputs");

async function sendMCPRequest(request: MCPRequest): Promise<MCPResponse> {
  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Server error response: ${errorText}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Check if response is SSE
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("text/event-stream")) {
    // Handle SSE response
    const text = await response.text();
    const lines = text.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data) {
          try {
            return JSON.parse(data);
          } catch (e) {
            console.error("Failed to parse SSE data:", data, e);
          }
        }
      }
    }

    throw new Error("No valid JSON data found in SSE response");
  }

  return response.json();
}

async function testHealthCheck() {
  console.log("Testing health-check tool...");

  const request: MCPRequest = {
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      name: "health-check",
      arguments: {},
    },
    id: 1,
  };

  try {
    const response = await sendMCPRequest(request);
    console.log("✓ health-check response:", JSON.stringify(response, null, 2));

    await saveOutput("health-check", response);
    return response;
  } catch (error) {
    console.error("✗ health-check failed:", error);
    throw error;
  }
}

async function testGetDesignTokens() {
  console.log("\nTesting get-design-tokens tool...");

  const testCases = [
    { theme: "asagi", category: "color" },
    { theme: "konjo", category: "color" },
    { category: "all" }, // Test default theme
    { theme: "sumire", category: "spacing" },
  ];

  for (const params of testCases) {
    console.log(`  Testing with params:`, params);

    const request: MCPRequest = {
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "get-design-tokens",
        arguments: params,
      },
      id: 2,
    };

    try {
      const response = await sendMCPRequest(request);
      console.log(`  ✓ Response received`);

      await saveOutput(`design-tokens-${JSON.stringify(params)}`, response);
    } catch (error) {
      console.error(`  ✗ Failed:`, error);
    }
  }
}

async function testGetComponentInfo() {
  console.log("\nTesting get-component-info tool...");

  const testCases = [
    {}, // Get all components
    { componentName: "button" },
    { componentName: "modal-dialog" },
    { componentName: "non-existent" }, // Test error case
  ];

  for (const params of testCases) {
    console.log(`  Testing with params:`, params);

    const request: MCPRequest = {
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "get-component-info",
        arguments: params,
      },
      id: 3,
    };

    try {
      const response = await sendMCPRequest(request);
      console.log(`  ✓ Response received`);

      const fileName = params.componentName
        ? `component-info-${params.componentName}`
        : "component-info-all";
      await saveOutput(fileName, response);
    } catch (error) {
      console.error(`  ✗ Failed:`, error);
    }
  }
}

async function testSearchDocumentation() {
  console.log("\nTesting search-documentation tool...");

  const testCases = [
    { query: "button" },
    { query: "button", category: "components" },
    { query: "getting started", category: "pages" },
    { query: "theme", limit: 5 },
  ];

  for (const params of testCases) {
    console.log(`  Testing with params:`, params);

    const request: MCPRequest = {
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "search-documentation",
        arguments: params,
      },
      id: 4,
    };

    try {
      const response = await sendMCPRequest(request);
      console.log(`  ✓ Response received`);

      await saveOutput(`search-${JSON.stringify(params)}`, response);
    } catch (error) {
      console.error(`  ✗ Failed:`, error);
    }
  }
}

async function saveOutput(name: string, data: unknown) {
  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Clean filename
  const fileName = name.replace(/[^a-zA-Z0-9-]/g, "_") + ".json";
  const filePath = path.join(OUTPUT_DIR, fileName);

  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`  → Saved to ${fileName}`);
}

async function listTools() {
  console.log("Listing available tools...");

  const request: MCPRequest = {
    jsonrpc: "2.0",
    method: "tools/list",
    id: 0,
  };

  try {
    const response = await sendMCPRequest(request);
    console.log("Available tools:", JSON.stringify(response.result, null, 2));
    await saveOutput("tools-list", response);
  } catch (error) {
    console.error("Failed to list tools:", error);
  }
}

async function checkServerStatus(): Promise<boolean> {
  try {
    const response = await fetch(MCP_URL.replace("/api/mcp", "/api/health"), {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log("=== MCP Server Test Client ===");
  console.log(`Server URL: ${MCP_URL}`);
  console.log(`Port: ${PORT}`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Check if server is running
  console.log("Checking if dev server is running...");
  const isServerRunning = await checkServerStatus();

  if (!isServerRunning) {
    console.error(`\n❌ Dev server is not running on port ${PORT}!`);
    console.error("\nPlease start the dev server first with:");
    console.error("  npm run dev");
    console.error("\nThen run this test again in another terminal.");
    console.error(`\nOr specify a different port: npm run test:mcp <port>`);
    process.exit(1);
  }

  console.log("✓ Dev server is running\n");

  try {
    // First, list available tools
    await listTools();

    // Test each tool
    await testHealthCheck();
    await testGetDesignTokens();
    await testGetComponentInfo();
    await testSearchDocumentation();

    console.log("\n✅ All tests completed!");
    console.log(`Results saved to: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error("\n❌ Test suite failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
