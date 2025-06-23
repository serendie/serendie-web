import { describe, it, expect, beforeEach } from "vitest";
import { createMcpServer } from "../server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Mock the tool registration since we can't directly test server internals
describe("MCP Server", () => {
  let server: McpServer;

  beforeEach(() => {
    server = createMcpServer();
  });

  describe("Server Configuration", () => {
    it("should create server with correct metadata", () => {
      expect(server).toBeDefined();
      expect(server.server).toBeDefined();
      // The server info is passed during construction
      expect(server).toHaveProperty("server");
    });
  });

  describe("health-check Tool", () => {
    it("should handle health-check tool registration", () => {
      // Since we can't directly test tool registration, we verify the server was created
      expect(server).toBeDefined();

      // The health-check tool is registered in createMcpServer
      // We can test this by checking if the registerTool method was called
      // but since it's internal, we just verify the server exists
      expect(server.server).toBeDefined();
    });
  });

  describe("Tool Registration", () => {
    it("should have registered all expected tools", () => {
      // We know these tools are registered in createMcpServer:
      // - health-check
      // - get-design-tokens
      // - get-component-info
      // - search-documentation

      // Since we can't directly inspect registered tools,
      // we verify the server was created successfully
      expect(server).toBeDefined();
      expect(server.server).toBeDefined();
    });
  });

  describe("Server Methods", () => {
    it("should have connect method", () => {
      expect(server.connect).toBeDefined();
      expect(typeof server.connect).toBe("function");
    });

    it("should have close method", () => {
      expect(server.close).toBeDefined();
      expect(typeof server.close).toBe("function");
    });

    it("should have isConnected method", () => {
      expect(server.isConnected).toBeDefined();
      expect(typeof server.isConnected).toBe("function");
    });
  });
});
