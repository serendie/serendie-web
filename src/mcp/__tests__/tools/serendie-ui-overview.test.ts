import { describe, it, expect } from "vitest";
import { createMcpServer } from "../../server";
import { SerendieUIOverviewResponseSchema } from "../../schemas/serendie-ui-overview";
import { getSerendieUIOverviewTool } from "../../tools/serendie-ui-overview";

describe("get-serendie-ui-overview", () => {
  it("should be registered when server is created", () => {
    const server = createMcpServer();
    expect(server).toBeDefined();
    expect(server.server).toBeDefined();
  });

  it("should return lightweight overview with sections list", async () => {
    // Test the tool function directly by creating a mock server
    let registeredToolConfig: unknown = null;
    let registeredHandler: unknown = null;

    const mockMcpServer = {
      registerTool: (name: string, config: unknown, handler: unknown) => {
        if (name === "get-serendie-ui-overview") {
          registeredToolConfig = config;
          registeredHandler = handler;
        }
      },
    };

    // Register the tool
    getSerendieUIOverviewTool(
      mockMcpServer as Parameters<typeof getSerendieUIOverviewTool>[0]
    );

    // Verify tool registration
    expect(registeredToolConfig).toBeDefined();
    const toolConfig = registeredToolConfig as {
      title: string;
      description: string;
      inputSchema: object;
    };
    expect(toolConfig.title).toBe("Get Serendie UI Overview");
    expect(toolConfig.description).toContain("MUST call this tool FIRST");
    expect(toolConfig.inputSchema).toEqual({});

    // Execute the tool handler
    expect(registeredHandler).toBeDefined();
    const handler = registeredHandler as (
      params: object
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;
    const result = await handler({});

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    // Parse and validate the response
    const responseData = JSON.parse(result.content[0].text);
    const validation = SerendieUIOverviewResponseSchema.safeParse(responseData);
    expect(validation.success).toBe(true);

    if (validation.success) {
      const data = validation.data;

      // 基本情報の確認
      expect(data.overview).toContain("@serendie/ui");
      expect(data.overview).toContain("三菱電機");
      expect(data.version).toBe("1.0.1");

      // セクション一覧の確認
      expect(data.sections).toBeInstanceOf(Array);
      expect(data.sections.length).toBe(12);

      // 最初のセクションの構造確認
      const firstSection = data.sections[0];
      expect(firstSection.id).toBe("architecture");
      expect(firstSection.title).toBe("アーキテクチャ");
      expect(firstSection.summary).toContain("React 18");
      expect(firstSection.detailCommand).toContain("get-serendie-ui-detail");
      expect(firstSection.detailCommand).toContain("architecture");

      // 他のセクションIDの確認
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sectionIds = data.sections.map((s: any) => s.id);
      expect(sectionIds).toContain("import-patterns");
      expect(sectionIds).toContain("styling-approach");
      expect(sectionIds).toContain("design-tokens");
      expect(sectionIds).toContain("component-categories");
      expect(sectionIds).toContain("common-patterns");
      expect(sectionIds).toContain("initial-setup");
      expect(sectionIds).toContain("package-relationships");
      expect(sectionIds).toContain("figma-integration");
      expect(sectionIds).toContain("component-defaults");
      expect(sectionIds).toContain("practical-examples");
      expect(sectionIds).toContain("best-practices");

      // contextualHelpの確認
      expect(data.contextualHelp).toBeDefined();
      expect(data.contextualHelp.forStyling).toBeInstanceOf(Array);
      expect(data.contextualHelp.forStyling).toContain("styling-approach");
      expect(data.contextualHelp.forStyling).toContain("design-tokens");
      expect(data.contextualHelp.forComponents).toBeInstanceOf(Array);
      expect(data.contextualHelp.forSetup).toBeInstanceOf(Array);

      // nextStepの確認
      expect(data.nextStep).toBeDefined();
      expect(data.nextStep.message).toBeDefined();
      expect(data.nextStep.command).toContain("get-serendie-ui-detail");
      expect(data.nextStep.command).toContain("architecture");
    }
  });

  it("should handle schema validation properly", () => {
    // Test that the schema properly validates the expected structure
    const validData = {
      overview: "Test overview",
      version: "1.0.0",
      sections: [
        {
          id: "architecture",
          title: "Test Title",
          summary: "Test Summary",
          detailCommand: "test-command",
        },
      ],
      contextualHelp: {
        forStyling: ["styling-approach"],
      },
      nextStep: {
        message: "Test message",
        command: "test-command",
      },
    };

    const validation = SerendieUIOverviewResponseSchema.safeParse(validData);
    expect(validation.success).toBe(true);

    // Test invalid data
    const invalidData = { invalid: "data" };
    const invalidValidation =
      SerendieUIOverviewResponseSchema.safeParse(invalidData);
    expect(invalidValidation.success).toBe(false);
  });
});
