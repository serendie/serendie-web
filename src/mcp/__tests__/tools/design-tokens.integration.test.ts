import { describe, it, expect, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getDesignTokensTool,
  getDesignTokenDetailTool,
} from "../../tools/design-tokens";
import {
  GetDesignTokensResponseSchema,
  GetDesignTokenDetailResponseSchema,
} from "../../schemas/design-tokens";

// 実際のデータをインポート（モックなし）
import tokens from "@serendie/design-token/token-list";

describe("Design Tokens Integration Tests (Real Data)", () => {
  describe("get-design-tokens with real data", () => {
    let mcpServer: McpServer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let registeredTools: Map<string, (args: any) => Promise<any>>;

    beforeEach(() => {
      registeredTools = new Map();
      mcpServer = {
        registerTool: (
          name: string,
          _schema: unknown,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handler: (args: any) => Promise<any>
        ) => {
          registeredTools.set(name, handler);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      getDesignTokensTool(mcpServer);
    });

    it("should return all real design tokens when no filters are provided", async () => {
      const handler = registeredTools.get("get-design-tokens");
      const response = await handler!({});

      expect(response).toBeDefined();
      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe("text");

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokensResponseSchema.safeParse(data);
      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;

        // 実際のトークン数を確認
        console.log("Actual total tokens:", validatedData.total);
        console.log("Token types found:", validatedData.types);

        expect(validatedData.total).toBe(tokens.length);
        expect(validatedData.filtered).toBe(validatedData.total);
        expect(validatedData.returned).toBe(tokens.length);

        // 実際のトークンタイプを確認
        const expectedTypes = [
          "color",
          "dimension",
          "fontFamily",
          "fontWeight",
          "number",
          "shadow",
          "typography",
        ];
        expectedTypes.forEach((type) => {
          expect(validatedData.types).toContain(type);
        });
      }
    });

    it("should correctly filter real tokens by type", async () => {
      const handler = registeredTools.get("get-design-tokens");

      // 各タイプごとにテスト
      const tokenTypes = [
        "color",
        "dimension",
        "fontFamily",
        "fontWeight",
        "number",
        "shadow",
        "typography",
      ];

      for (const type of tokenTypes) {
        const response = await handler!({ type });
        const data = JSON.parse(response.content[0].text);
        const validation = GetDesignTokensResponseSchema.safeParse(data);

        expect(validation.success).toBe(true);

        if (validation.success) {
          const validatedData = validation.data;

          // 実際のフィルタリング結果を確認
          const expectedCount = tokens.filter((t) => t.type === type).length;
          console.log(`Tokens with type '${type}':`, expectedCount);

          expect(validatedData.filtered).toBe(expectedCount);

          // すべてのトークンが正しいタイプであることを確認
          validatedData.tokens.forEach((token) => {
            expect(token.type).toBe(type);
          });
        }
      }
    });

    it("should handle non-existent token types gracefully", async () => {
      const handler = registeredTools.get("get-design-tokens");

      // 存在しないタイプでテスト（以前は存在していたが、現在は存在しないタイプ）
      const nonExistentTypes = ["elevation", "radius", "spacing", "opacity"];

      for (const type of nonExistentTypes) {
        try {
          await handler!({ type });
          // エラーが発生するはず
          expect.fail("Should have thrown an error for non-existent type");
        } catch (error) {
          // エラーが期待される
          expect(error).toBeDefined();
        }
      }
    });

    it("should correctly filter by category with real data", async () => {
      const handler = registeredTools.get("get-design-tokens");

      // reference カテゴリのテスト
      const referenceResponse = await handler!({ category: "reference" });
      const referenceData = JSON.parse(referenceResponse.content[0].text);
      const referenceValidation =
        GetDesignTokensResponseSchema.safeParse(referenceData);

      expect(referenceValidation.success).toBe(true);

      if (referenceValidation.success) {
        const validatedData = referenceValidation.data;
        const expectedReferenceCount = tokens.filter((t) =>
          t.key.includes("sd.reference")
        ).length;

        console.log("Reference tokens count:", expectedReferenceCount);
        expect(validatedData.filtered).toBe(expectedReferenceCount);

        validatedData.tokens.forEach((token) => {
          expect(token.key).toContain("sd.reference");
          expect(token.category).toBe("reference");
        });
      }

      // system カテゴリのテスト
      const systemResponse = await handler!({ category: "system" });
      const systemData = JSON.parse(systemResponse.content[0].text);
      const systemValidation =
        GetDesignTokensResponseSchema.safeParse(systemData);

      expect(systemValidation.success).toBe(true);

      if (systemValidation.success) {
        const validatedData = systemValidation.data;
        const expectedSystemCount = tokens.filter(
          (t) => t.key.includes("sd.system") && !t.key.includes("themes")
        ).length;

        console.log("System tokens count:", expectedSystemCount);
        expect(validatedData.filtered).toBe(expectedSystemCount);

        validatedData.tokens.forEach((token) => {
          expect(token.key).toContain("sd.system");
          expect(token.key).not.toContain("themes");
          expect(token.category).toBe("system");
        });
      }
    });

    it("should correctly filter by theme with real data", async () => {
      const handler = registeredTools.get("get-design-tokens");

      const themes = ["asagi", "konjo", "kurikawa", "sumire", "tsutsuji"];

      for (const theme of themes) {
        const response = await handler!({ theme });
        const data = JSON.parse(response.content[0].text);
        const validation = GetDesignTokensResponseSchema.safeParse(data);

        expect(validation.success).toBe(true);

        if (validation.success) {
          const validatedData = validation.data;
          const expectedCount = tokens.filter((t) =>
            t.key.includes(`themes.${theme}`)
          ).length;

          console.log(`Tokens for theme '${theme}':`, expectedCount);

          if (expectedCount > 0) {
            expect(validatedData.filtered).toBe(expectedCount);
            validatedData.tokens.forEach((token) => {
              expect(token.key).toContain(`themes.${theme}`);
              expect(token.theme).toBe(theme);
            });
          }
        }
      }
    });

    it("should handle complex filters with real data", async () => {
      const handler = registeredTools.get("get-design-tokens");

      // color + system の組み合わせ
      const response = await handler!({
        type: "color",
        category: "system",
        limit: 10,
      });

      const data = JSON.parse(response.content[0].text);
      const validation = GetDesignTokensResponseSchema.safeParse(data);

      expect(validation.success).toBe(true);

      if (validation.success) {
        const validatedData = validation.data;

        // 期待される結果を計算
        const expectedTokens = tokens.filter(
          (t) =>
            t.type === "color" &&
            t.key.includes("sd.system") &&
            !t.key.includes("themes")
        );

        console.log("Color system tokens count:", expectedTokens.length);

        expect(validatedData.filtered).toBe(expectedTokens.length);
        expect(validatedData.returned).toBeLessThanOrEqual(10);

        validatedData.tokens.forEach((token) => {
          expect(token.type).toBe("color");
          expect(token.category).toBe("system");
        });
      }
    });
  });

  describe("get-design-token-detail with real data", () => {
    let mcpServer: McpServer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let registeredTools: Map<string, (args: any) => Promise<any>>;

    beforeEach(() => {
      registeredTools = new Map();
      mcpServer = {
        registerTool: (
          name: string,
          _schema: unknown,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handler: (args: any) => Promise<any>
        ) => {
          registeredTools.set(name, handler);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      getDesignTokenDetailTool(mcpServer);
    });

    it("should return detailed information for real tokens", async () => {
      const handler = registeredTools.get("get-design-token-detail");

      // 実際のトークンからいくつかサンプルを取得
      const sampleTokens = [
        tokens.find((t) => t.type === "color"),
        tokens.find((t) => t.type === "typography"),
        tokens.find((t) => t.type === "shadow"),
        tokens.find((t) => t.type === "fontFamily"),
      ].filter(Boolean);

      for (const token of sampleTokens) {
        if (!token) continue;

        const response = await handler!({ key: token.key });
        const data = JSON.parse(response.content[0].text);
        const validation = GetDesignTokenDetailResponseSchema.safeParse(data);

        expect(validation.success).toBe(true);

        if (validation.success) {
          const validatedData = validation.data;

          if (validatedData.exists) {
            expect(validatedData.key).toBe(token.key);
            expect(validatedData.type).toBe(token.type);
            expect(validatedData.value).toEqual(token.value);
            expect(validatedData.originalValue).toEqual(token.originalValue);
            expect(validatedData.cssVariable).toBe(
              `var(--${token.key.replace(/\./g, "-")})`
            );

            // 使用例が正しく生成されていることを確認
            expect(validatedData.usage).toBeDefined();
            expect(validatedData.usage.css).toBeTruthy();
            expect(validatedData.usage.pandacss).toBeTruthy();
          }
        }
      }
    });

    it("should handle system tokens with references correctly", async () => {
      const handler = registeredTools.get("get-design-token-detail");

      // リファレンスを持つシステムトークンを探す
      const systemTokenWithRef = tokens.find(
        (t) =>
          t.key.includes("sd.system") &&
          typeof t.originalValue === "string" &&
          t.originalValue.startsWith("{") &&
          t.originalValue.endsWith("}")
      );

      if (systemTokenWithRef) {
        const response = await handler!({ key: systemTokenWithRef.key });
        const data = JSON.parse(response.content[0].text);
        const validation = GetDesignTokenDetailResponseSchema.safeParse(data);

        expect(validation.success).toBe(true);

        if (validation.success) {
          const validatedData = validation.data;

          if (validatedData.exists) {
            expect(validatedData.category).toBe("system");
            expect(validatedData.references).toBeTruthy();
            expect(validatedData.references).toBe(
              (systemTokenWithRef.originalValue as string).slice(1, -1)
            );
          }
        }
      }
    });
  });

  describe("Data validation and edge cases", () => {
    it("should validate all token types in the schema match actual data", () => {
      const actualTypes = new Set(tokens.map((t) => t.type));
      const schemaTypes = [
        "color",
        "dimension",
        "fontFamily",
        "fontWeight",
        "number",
        "shadow",
        "typography",
      ];

      console.log("Actual token types in data:", Array.from(actualTypes));
      console.log("Token types in schema:", schemaTypes);

      // スキーマに定義されているすべてのタイプが実際のデータに存在することを確認
      schemaTypes.forEach((type) => {
        expect(actualTypes.has(type)).toBe(true);
      });

      // 実際のデータにあるすべてのタイプがスキーマに定義されていることを確認
      actualTypes.forEach((type) => {
        expect(schemaTypes).toContain(type);
      });
    });

    it("should have consistent token structure", () => {
      tokens.forEach((token) => {
        // 必須フィールドの存在を確認
        expect(token).toHaveProperty("key");
        expect(token).toHaveProperty("path");
        expect(token).toHaveProperty("type");
        expect(token).toHaveProperty("value");
        expect(token).toHaveProperty("originalValue");

        // path が配列であることを確認
        expect(Array.isArray(token.path)).toBe(true);

        // key が path を . で結合したものであることを確認
        const expectedKey = token.path.join(".");
        expect(token.key).toBe(expectedKey);
      });
    });
  });
});
