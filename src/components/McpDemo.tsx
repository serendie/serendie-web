import React, { useState, useEffect } from "react";
import { useMcp } from "use-mcp/react";
import { css } from "../../styled-system/css";
import { Button, Select, TextArea, TextField } from "@serendie/ui";

interface McpToolParameter {
  type: string;
  required?: boolean;
  description?: string;
  enum?: string[];
}

interface McpTool {
  name: string;
  description: string;
  parameters?: Record<string, McpToolParameter>;
}

export default function McpDemo() {
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [parameters, setParameters] = useState<Record<string, string | number>>(
    {}
  );
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { state, tools, callTool } = useMcp({
    url: "http://localhost:4321/sse",
    clientName: "Serendie Web Demo",
    autoReconnect: true,
  });

  // Extract tool information from useMcp tools
  const toolDescriptions: McpTool[] = tools.map((tool) => ({
    name: tool.name,
    description: tool.description || "",
    parameters:
      (tool.inputSchema?.properties as Record<string, McpToolParameter>) || {},
  }));

  useEffect(() => {
    // Set default selected tool when tools are loaded
    if (tools.length > 0 && !selectedTool) {
      setSelectedTool(tools[0].name);
    }
  }, [tools, selectedTool]);

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
            const paramDef = currentTool.parameters?.[key];
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
              color: "sd.reference.color.scale.green.500",
            })}
          >
            MCPサーバーに接続されました。利用可能なツール: {tools.length}個
          </div>

          <Select
            label="ツールを選択"
            placeholder="ツールを選択してください"
            value={selectedTool ? [selectedTool] : []}
            onValueChange={(details) => setSelectedTool(details.value[0])}
            items={toolDescriptions.map((tool) => ({
              label: `${tool.name}`,
              value: tool.name,
            }))}
          />

          {currentTool &&
            currentTool.parameters &&
            Object.keys(currentTool.parameters).length > 0 && (
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
                {Object.entries(currentTool.parameters).map(([key, param]) => {
                  if (param.enum) {
                    return (
                      <Select
                        key={key}
                        label={key}
                        placeholder={param.description || `Select ${key}`}
                        value={
                          parameters[key] ? [parameters[key].toString()] : []
                        }
                        onValueChange={(details) =>
                          setParameters({
                            ...parameters,
                            [key]: details.value[0],
                          })
                        }
                        items={param.enum.map((value) => ({
                          label: value,
                          value: value,
                        }))}
                      />
                    );
                  }

                  return (
                    <TextField
                      key={key}
                      label={key}
                      description={param.description}
                      placeholder={param.description}
                      required={param.required}
                      type={param.type === "number" ? "number" : "text"}
                      value={parameters[key]?.toString() || ""}
                      onChange={(e) =>
                        setParameters({
                          ...parameters,
                          [key]: e.target.value,
                        })
                      }
                    />
                  );
                })}
              </div>
            )}

          <Button
            onClick={handleCallTool}
            disabled={!isConnected || isLoading || !selectedTool}
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
                  width: "100%",
                })}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
