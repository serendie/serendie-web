import { describe, expect, it } from "vitest";
import { createMcpServer } from "../../server";
import { getSerendieUIOverviewTool } from "../../tools/serendie-ui-overview";
import {
  loadSerendieUIOverviewMarkdown,
  serendieUIOverviewMarkdown,
} from "../../schemas/serendie-ui-overview";

describe("get-serendie-ui-overview", () => {
  it("should be registered when server is created", () => {
    const server = createMcpServer();
    expect(server).toBeDefined();
    expect(server.server).toBeDefined();
  });

  it("should return markdown overview content with key sections", async () => {
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

    getSerendieUIOverviewTool(
      mockMcpServer as Parameters<typeof getSerendieUIOverviewTool>[0]
    );

    expect(registeredToolConfig).toBeDefined();
    const toolConfig = registeredToolConfig as {
      title: string;
      description: string;
      inputSchema: object;
    };
    expect(toolConfig.title).toBe("Get Serendie UI Overview");
    expect(toolConfig.description).toContain("MUST call this tool FIRST");
    expect(toolConfig.description).toContain("Markdown");
    expect(toolConfig.inputSchema).toEqual({});

    expect(registeredHandler).toBeDefined();
    const handler = registeredHandler as (
      params: object
    ) => Promise<{ content: Array<{ type: string; text: string }> }>;

    const result = await handler({});

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");

    const markdown = result.content[0].text;
    expect(markdown).toContain("npm install @serendie/ui");
  });

  it("should expose the markdown helper content", async () => {
    const markdownFromHelper = await loadSerendieUIOverviewMarkdown();

    expect(markdownFromHelper).toBe(serendieUIOverviewMarkdown);
    expect(markdownFromHelper).toContain("npm install @serendie/ui");
  });
});
