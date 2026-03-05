import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseCliOptions } from "../options";

describe("parseCliOptions", () => {
  it("デフォルト出力先を返す", () => {
    const options = parseCliOptions([]);
    expect(options.outputPath).toBe(
      path.resolve(process.cwd(), "src/mcp/data/component-keys.json")
    );
  });

  it("--out 形式の出力先を解決する", () => {
    const options = parseCliOptions(["--out", "tmp/component-keys.json"]);
    expect(options.outputPath).toBe(
      path.resolve(process.cwd(), "tmp/component-keys.json")
    );
  });

  it("--out に値が無い場合はエラー", () => {
    expect(() => parseCliOptions(["--out"])).toThrow(
      "`--out` requires an output file path."
    );
  });
});
