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

  it("should return comprehensive overview information with correct schema", async () => {
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

      // アーキテクチャ情報の確認
      expect(data.architecture.framework).toContain("React 18");
      expect(data.architecture.styling).toContain("PandaCSS");
      expect(data.architecture.dependencies).toHaveProperty("@ark-ui/react");
      expect(data.architecture.dependencies).toHaveProperty(
        "@serendie/design-token"
      );
      expect(data.architecture.dependencies).toHaveProperty(
        "@serendie/symbols"
      );

      // カテゴリの確認
      const categories = Object.keys(data.componentCategories);
      expect(categories).toContain("Actions");
      expect(categories).toContain("Inputs");
      expect(categories).toContain("Layout");
      expect(categories).toContain("Display");
      expect(categories).toContain("Feedback");
      expect(categories).toContain("Other");

      // インポートパターンの確認
      expect(data.importPatterns.component.pattern).toContain("@serendie/ui");
      expect(data.importPatterns.component.example).toContain("Button");
      expect(data.importPatterns.component.note).toBeDefined();
      expect(data.importPatterns.icons.import).toContain("@serendie/symbols");
      expect(data.importPatterns.icons.variants).toContain("outlined");
      expect(data.importPatterns.icons.variants).toContain("filled");

      // テーマの確認
      expect(data.themes.available).toContain("asagi");
      expect(data.themes.available).toContain("konjo");
      expect(data.themes.available).toContain("kurikawa");
      expect(data.themes.available).toContain("sumire");
      expect(data.themes.available).toContain("tsutsuji");
      expect(data.themes.default).toBe("asagi");
      expect(data.themes.usage).toBeDefined();

      // スタイリング方法の確認
      expect(data.stylingApproach.method).toBe("PandaCSS");
      expect(data.stylingApproach.patterns).toContain("css()");
      expect(data.stylingApproach.patterns).toContain("sva()");
      expect(data.stylingApproach.patterns).toContain("textStyle");
      // 圧縮版では css(), sva(), textStyle
      expect(data.stylingApproach.patterns).toHaveLength(3);
      expect(data.stylingApproach.tokens).toBeDefined();
      expect(data.stylingApproach.example).toBeDefined();

      // ガイドラインとベストプラクティスの確認（圧縮版）
      expect(data.developmentGuidelines).toBeInstanceOf(Array);
      expect(data.developmentGuidelines.length).toBeGreaterThanOrEqual(3);
      expect(data.bestPractices).toBeInstanceOf(Array);
      expect(data.bestPractices.length).toBeGreaterThanOrEqual(6);

      // 共通パターンの確認
      expect(data.commonPatterns.props.variant).toBeDefined();
      expect(data.commonPatterns.props.size).toBeDefined();
      expect(data.commonPatterns.props.colorScheme).toBeDefined();
      expect(data.commonPatterns.props.asChild).toBeDefined();
      expect(data.commonPatterns.composition).toContain("Ark UI");

      // リソースの確認
      expect(data.resources.documentation).toBe("https://serendie.design/");
      expect(data.resources.storybook).toBe(
        "https://storybook.serendie.design/"
      );
      expect(data.resources.github).toBe(
        "https://github.com/serendie/serendie"
      );
      expect(data.resources.figma).toBeDefined();

      // 初期セットアップの確認
      expect(data.initialSetup).toBeDefined();
      expect(data.initialSetup.overview).toBeDefined();
      expect(data.initialSetup.steps).toBeInstanceOf(Array);
      expect(data.initialSetup.steps.length).toBeGreaterThan(0);
      expect(data.initialSetup.warnings).toBeInstanceOf(Array);
      expect(data.initialSetup.doNotDo).toBeInstanceOf(Array);

      // パッケージ関係性の確認
      expect(data.packageRelationships).toBeDefined();
      expect(data.packageRelationships.overview).toBeDefined();
      expect(data.packageRelationships.packages).toHaveProperty("@serendie/ui");
      expect(data.packageRelationships.packages).toHaveProperty(
        "@serendie/design-token"
      );
      expect(data.packageRelationships.packages).toHaveProperty(
        "@serendie/symbols"
      );
      expect(data.packageRelationships.designFlow).toBeDefined();

      // デザイントークンガイドラインの確認
      expect(data.designTokenGuidelines).toBeDefined();
      expect(data.designTokenGuidelines.importance).toBeDefined();
      expect(data.designTokenGuidelines.tokenTypes).toBeDefined();
      if (data.designTokenGuidelines.tokenTypes) {
        expect(data.designTokenGuidelines.tokenTypes.reference).toContain(
          "直接使用禁止"
        );
        expect(data.designTokenGuidelines.tokenTypes.system).toContain(
          "必ずこちらを使用"
        );
      }
      expect(data.designTokenGuidelines.priority).toBeInstanceOf(Array);
      expect(data.designTokenGuidelines.priority[0]).toContain(
        "システムトークン"
      );
      expect(data.designTokenGuidelines.commonMistakes).toBeInstanceOf(Array);
      // 圧縮版では correct のみ
      expect(data.designTokenGuidelines.examples).toHaveProperty("correct");
      expect(data.designTokenGuidelines.examples.correct).toHaveProperty(
        "good"
      );
      expect(data.designTokenGuidelines.examples.correct).toHaveProperty("bad");
      expect(data.designTokenGuidelines.examples.correct).toHaveProperty(
        "veryBad"
      );

      // Figma統合の確認
      expect(data.figmaIntegration).toBeDefined();
      expect(data.figmaIntegration.overview).toBeDefined();
      expect(data.figmaIntegration.figmaVariables).toBeDefined();
      expect(data.figmaIntegration.codeConnect).toBeDefined();
      expect(data.figmaIntegration.workflow).toBeInstanceOf(Array);
      // 圧縮版では workflow は空配列
      expect(data.figmaIntegration.workflow).toHaveLength(0);
    }
  });

  it("should handle schema validation properly", () => {
    // Test that the schema properly validates the expected structure
    const validData = {
      overview: "Test overview",
      version: "1.0.0",
      architecture: {
        framework: "Test framework",
        styling: "Test styling",
        dependencies: {
          "@ark-ui/react": "Test",
          "framer-motion": "Test",
          "@serendie/design-token": "Test",
          "@serendie/symbols": "Test",
        },
      },
      componentCategories: {
        Actions: "Test",
      },
      importPatterns: {
        component: {
          pattern: "Test pattern",
          example: "Test example",
        },
        icons: {
          import: "Test import",
          usage: "Test usage",
          variants: ["test"],
          note: "Test note",
        },
      },
      themes: {
        available: ["asagi"],
        default: "asagi",
        usage: "Test usage",
      },
      stylingApproach: {
        method: "Test",
        patterns: ["test"],
        tokens: "Test",
        example: "Test",
      },
      developmentGuidelines: ["Test"],
      commonPatterns: {
        props: {
          variant: "Test",
          size: "Test",
          colorScheme: "Test",
          asChild: "Test",
        },
        composition: "Test",
      },
      resources: {
        documentation: "https://test.com/",
        storybook: "https://test.com/",
        github: "https://test.com/",
        figma: "Test",
      },
      bestPractices: ["Test"],
      initialSetup: {
        overview: "Test overview",
        steps: ["Step 1"],
        warnings: ["Warning 1"],
        doNotDo: ["Don't do this"],
      },
      packageRelationships: {
        overview: "Test overview",
        packages: {
          "@serendie/ui": {
            description: "Test",
            role: "Test",
            mcpTool: "test-tool",
          },
        },
        designFlow: "Test flow",
      },
      designTokenGuidelines: {
        importance: "Test importance",
        tokenTypes: {
          reference: "Test reference",
          system: "Test system",
        },
        priority: ["Priority 1"],
        commonMistakes: ["Mistake 1"],
        examples: {
          correct: {
            good: "Good example",
            bad: "Bad example",
            veryBad: "Very bad example",
          },
        },
      },
      figmaIntegration: {
        overview: "Test overview",
        figmaVariables: "Test variables",
        codeConnect: "Test connect",
        workflow: ["Step 1"],
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
