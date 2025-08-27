import { describe, it, expect } from "vitest";
import { createMcpServer } from "../../server";
import { SerendieUIDetailResponseSchema } from "../../schemas/serendie-ui-detail";
import { getSerendieUIDetailTool } from "../../tools/serendie-ui-detail";

describe("get-serendie-ui-detail", () => {
  it("should be registered when server is created", () => {
    const server = createMcpServer();
    expect(server).toBeDefined();
    expect(server.server).toBeDefined();
  });

  it("should return detailed information for architecture section", async () => {
    // Test the tool function directly by creating a mock server
    let registeredToolConfig: unknown = null;
    let registeredHandler: unknown = null;

    const mockMcpServer = {
      registerTool: (name: string, config: unknown, handler: unknown) => {
        if (name === "get-serendie-ui-detail") {
          registeredToolConfig = config;
          registeredHandler = handler;
        }
      },
    };

    // Register the tool
    getSerendieUIDetailTool(
      mockMcpServer as Parameters<typeof getSerendieUIDetailTool>[0]
    );

    // Verify tool registration
    expect(registeredToolConfig).toBeDefined();
    const toolConfig = registeredToolConfig as {
      title: string;
      description: string;
      inputSchema: object;
    };
    expect(toolConfig.title).toBe("Get Serendie UI Detail");
    expect(toolConfig.description).toContain("specific section");
    expect(toolConfig.inputSchema).toBeDefined();

    // Execute the tool handler with architecture section
    expect(registeredHandler).toBeDefined();
    const handler = registeredHandler as (
      params: object
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;
    const result = await handler({ section: "architecture" });

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    // Parse and validate the response
    const responseData = JSON.parse(result.content[0].text);
    const validation = SerendieUIDetailResponseSchema.safeParse(responseData);
    expect(validation.success).toBe(true);

    if (validation.success) {
      const data = validation.data;

      // 基本情報の確認
      expect(data.section).toBe("architecture");
      expect(data.title).toBe("アーキテクチャ");
      expect(data.progress).toBe("1/12");

      // contentの確認
      expect(data.content).toBeDefined();
      expect(data.content.framework).toContain("React 18");
      expect(data.content.styling).toContain("PandaCSS");
      expect(data.content.dependencies).toBeDefined();
      expect(data.content.dependencies["@ark-ui/react"]).toBeDefined();

      // nextStepの確認
      expect(data.nextStep).toBeDefined();
      expect(data.nextStep?.message).toBeDefined();
      expect(data.nextStep?.command).toContain("get-serendie-ui-detail");
      expect(data.nextStep?.command).toContain("import-patterns");
    }
  });

  it("should return detailed information for design-tokens section", async () => {
    let registeredHandler: unknown = null;

    const mockMcpServer = {
      registerTool: (name: string, config: unknown, handler: unknown) => {
        if (name === "get-serendie-ui-detail") {
          registeredHandler = handler;
        }
      },
    };

    getSerendieUIDetailTool(
      mockMcpServer as Parameters<typeof getSerendieUIDetailTool>[0]
    );

    const handler = registeredHandler as (
      params: object
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;
    const result = await handler({ section: "design-tokens" });

    const responseData = JSON.parse(result.content[0].text);
    const validation = SerendieUIDetailResponseSchema.safeParse(responseData);
    expect(validation.success).toBe(true);

    if (validation.success) {
      const data = validation.data;

      expect(data.section).toBe("design-tokens");
      expect(data.title).toBe("デザイントークンガイドライン");
      expect(data.progress).toBe("4/12");

      // デザイントークン特有のcontent確認
      expect(data.content.importance).toBeDefined();
      expect(data.content.tokenTypes).toBeDefined();
      expect(data.content.priority).toBeInstanceOf(Array);
      expect(data.content.commonMistakes).toBeInstanceOf(Array);
      expect(data.content.spacingTokens).toBeDefined();
    }
  });

  it("should return detailed information for last section", async () => {
    let registeredHandler: unknown = null;

    const mockMcpServer = {
      registerTool: (name: string, config: unknown, handler: unknown) => {
        if (name === "get-serendie-ui-detail") {
          registeredHandler = handler;
        }
      },
    };

    getSerendieUIDetailTool(
      mockMcpServer as Parameters<typeof getSerendieUIDetailTool>[0]
    );

    const handler = registeredHandler as (
      params: object
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;
    const result = await handler({ section: "best-practices" });

    const responseData = JSON.parse(result.content[0].text);
    const validation = SerendieUIDetailResponseSchema.safeParse(responseData);
    expect(validation.success).toBe(true);

    if (validation.success) {
      const data = validation.data;

      expect(data.section).toBe("best-practices");
      expect(data.title).toBe("ベストプラクティス");
      expect(data.progress).toBe("12/12");

      // 最後のセクションなのでnextStepのメッセージが異なる
      expect(data.nextStep).toBeDefined();
      expect(data.nextStep?.message).toContain("ウォークスルー完了");
    }
  });

  it("should handle invalid section ID", async () => {
    let registeredHandler: unknown = null;

    const mockMcpServer = {
      registerTool: (name: string, config: unknown, handler: unknown) => {
        if (name === "get-serendie-ui-detail") {
          registeredHandler = handler;
        }
      },
    };

    getSerendieUIDetailTool(
      mockMcpServer as Parameters<typeof getSerendieUIDetailTool>[0]
    );

    const handler = registeredHandler as (
      params: object
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;

    // 不正なセクションIDでエラーが返される
    const result = await handler({ section: "invalid-section" });
    const responseData = JSON.parse(result.content[0].text);

    expect(responseData.error).toBeDefined();
    expect(responseData.message).toBeDefined();
  });

  it("should validate all section IDs are accessible", async () => {
    let registeredHandler: unknown = null;

    const mockMcpServer = {
      registerTool: (name: string, config: unknown, handler: unknown) => {
        if (name === "get-serendie-ui-detail") {
          registeredHandler = handler;
        }
      },
    };

    getSerendieUIDetailTool(
      mockMcpServer as Parameters<typeof getSerendieUIDetailTool>[0]
    );

    const handler = registeredHandler as (
      params: object
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;

    const sectionIds = [
      "architecture",
      "import-patterns",
      "styling-approach",
      "design-tokens",
      "component-categories",
      "common-patterns",
      "initial-setup",
      "package-relationships",
      "figma-integration",
      "component-defaults",
      "practical-examples",
      "best-practices",
    ];

    for (const sectionId of sectionIds) {
      const result = await handler({ section: sectionId });
      const responseData = JSON.parse(result.content[0].text);
      const validation = SerendieUIDetailResponseSchema.safeParse(responseData);

      expect(validation.success).toBe(true);
      if (validation.success) {
        expect(validation.data.section).toBe(sectionId);
        expect(validation.data.progress).toBeDefined();
        expect(validation.data.content).toBeDefined();
      }
    }
  });
});
