import React, { useState, useEffect } from "react";
import { useMcp } from "use-mcp/react";
import { css } from "../../styled-system/css";
import { Button } from "@serendie/ui";
import { TextArea } from "@serendie/ui";

interface McpTool {
  name: string;
  description: string;
  parameters: Record<
    string,
    {
      type: string;
      required?: boolean;
      description?: string;
    }
  >;
}

const toolDescriptions: McpTool[] = [
  {
    name: "health-check",
    description: "サーバーステータスのチェック",
    parameters: {},
  },
  {
    name: "get-symbols",
    description: "シンボルのリストを取得",
    parameters: {
      search: { type: "string", description: "検索キーワード" },
      limit: { type: "number", description: "最大結果数" },
    },
  },
  {
    name: "get-symbol-detail",
    description: "特定のシンボルの詳細を取得",
    parameters: {
      name: { type: "string", required: true, description: "シンボル名" },
    },
  },
  {
    name: "get-design-tokens",
    description: "デザイントークンのリストを取得",
    parameters: {
      search: { type: "string", description: "キーワード検索" },
      type: {
        type: "string",
        description: "トークンタイプ (color, typography等)",
      },
      category: { type: "string", description: "カテゴリ (reference, system)" },
      theme: { type: "string", description: "テーマ (asagi, konjo等)" },
      limit: { type: "number", description: "最大結果数" },
    },
  },
  {
    name: "get-design-token-detail",
    description: "特定のデザイントークンの詳細を取得",
    parameters: {
      key: { type: "string", required: true, description: "トークンキー" },
    },
  },
];

export default function McpDemo() {
  const [selectedTool, setSelectedTool] = useState<string>("health-check");
  const [parameters, setParameters] = useState<Record<string, string | number>>(
    {}
  );
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { state, tools, callTool } = useMcp({
    url: "https://serendie-web-workers.takram-spread.workers.dev/sse",
    clientName: "Serendie Web Demo",
    autoReconnect: true,
  });

  useEffect(() => {
    // Reset parameters when tool changes
    setParameters({});
    setResponse("");
    setError("");
  }, [selectedTool]);

  const handleCallTool = async () => {
    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const currentTool = toolDescriptions.find((t) => t.name === selectedTool);
      if (!currentTool) return;

      // Clean up parameters (remove empty strings)
      const cleanParams = Object.entries(parameters).reduce(
        (acc, [key, value]) => {
          if (value !== "" && value !== undefined && value !== null) {
            // Convert number strings to numbers if needed
            const paramDef = currentTool.parameters[key];
            if (paramDef?.type === "number" && typeof value === "string") {
              acc[key] = parseInt(value, 10);
            } else {
              acc[key] = value;
            }
          }
          return acc;
        },
        {} as Record<string, string | number>
      );

      const result = await callTool(selectedTool, cleanParams);

      if (result?.content?.[0]?.text) {
        const resultText = result.content[0].text;
        try {
          // Try to parse and pretty-print JSON
          const parsed = JSON.parse(resultText);
          setResponse(JSON.stringify(parsed, null, 2));
        } catch {
          // If not JSON, show as-is
          setResponse(resultText);
        }
      } else {
        setResponse(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const currentTool = toolDescriptions.find((t) => t.name === selectedTool);
  const isConnected = state === "ready";

  return (
    <div
      className={css({ display: "flex", flexDirection: "column", gap: "6" })}
    >
      {state === "connecting" && (
        <div
          className={css({
            p: "4",
            borderRadius: "md",
            bg: "blue.50",
            color: "blue.700",
          })}
        >
          MCPサーバーに接続中...
        </div>
      )}

      {state === "failed" && (
        <div
          className={css({
            p: "4",
            borderRadius: "md",
            bg: "red.50",
            color: "red.700",
          })}
        >
          MCPサーバーへの接続に失敗しました。サーバーが起動していることを確認してください。
        </div>
      )}

      {state === "ready" && (
        <>
          <div
            className={css({
              p: "4",
              borderRadius: "md",
              bg: "green.50",
              color: "green.700",
            })}
          >
            MCPサーバーに接続されました。利用可能なツール: {tools.length}個
          </div>

          <div>
            <label htmlFor="tool-select">ツールを選択</label>
            <select
              id="tool-select"
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className={css({
                width: "100%",
                p: "2",
                borderRadius: "md",
                border: "1px solid",
                borderColor: "gray.200",
                bg: "background",
                cursor: "pointer",
              })}
            >
              {toolDescriptions.map((tool) => (
                <option key={tool.name} value={tool.name}>
                  {tool.name} - {tool.description}
                </option>
              ))}
            </select>
          </div>

          {currentTool && Object.keys(currentTool.parameters).length > 0 && (
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "4",
              })}
            >
              <h3 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
                パラメータ
              </h3>
              {Object.entries(currentTool.parameters).map(([key, param]) => (
                <div key={key}>
                  <label htmlFor={`param-${key}`}>
                    {key}{" "}
                    {param.required && (
                      <span className={css({ color: "red.500" })}>*</span>
                    )}
                    {param.description && (
                      <span
                        className={css({
                          fontSize: "sm",
                          color: "gray.500",
                          ml: "2",
                        })}
                      >
                        ({param.description})
                      </span>
                    )}
                  </label>
                  <input
                    id={`param-${key}`}
                    type={param.type === "number" ? "number" : "text"}
                    value={parameters[key] || ""}
                    onChange={(e) =>
                      setParameters({
                        ...parameters,
                        [key]: e.target.value,
                      })
                    }
                    placeholder={param.description}
                    className={css({
                      width: "100%",
                      p: "2",
                      mt: "1",
                      borderRadius: "md",
                      border: "1px solid",
                      borderColor: "gray.200",
                    })}
                  />
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleCallTool}
            disabled={!isConnected || isLoading}
            className={css({ width: "fit-content" })}
          >
            {isLoading ? "実行中..." : "実行"}
          </Button>

          {error && (
            <div
              className={css({
                p: "4",
                borderRadius: "md",
                bg: "red.50",
                color: "red.700",
              })}
            >
              エラー: {error}
            </div>
          )}

          {response && (
            <div>
              <h3
                className={css({
                  fontSize: "lg",
                  fontWeight: "semibold",
                  mb: "2",
                })}
              >
                レスポンス
              </h3>
              <TextArea
                value={response}
                readOnly
                rows={15}
                className={css({
                  fontFamily: "mono",
                  fontSize: "sm",
                  bg: "gray.50",
                  resize: "vertical",
                })}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
