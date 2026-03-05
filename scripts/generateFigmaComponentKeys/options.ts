import path from "node:path";

const DEFAULT_OUTPUT_PATH = path.resolve(
  process.cwd(),
  "src/mcp/data/component-keys.json"
);
const OUT_FLAG = "--out";

/**
 * generateFigmaComponentKeysスクリプトのCLIオプション。
 */
export interface GenerateFigmaComponentKeysCliOptions {
  outputPath: string;
}

/**
 * `--out <path>` 形式の引数から出力先パス文字列を取り出す。
 * `--out` が未指定の場合は `undefined` を返す。
 */
function resolveOutValue(argv: string[]): string | undefined {
  const outFlagIndex = argv.indexOf(OUT_FLAG);
  if (outFlagIndex !== -1) {
    return argv[outFlagIndex + 1];
  }
  return undefined;
}

/**
 * CLI引数を解析し、出力先を絶対パスで返す。
 * `--out` 指定が無い場合はデフォルト出力先を利用する。
 */
export function parseCliOptions(
  argv: string[]
): GenerateFigmaComponentKeysCliOptions {
  const hasOutFlag = argv.includes(OUT_FLAG);

  const outValue = resolveOutValue(argv);
  if (!hasOutFlag) {
    return {
      outputPath: DEFAULT_OUTPUT_PATH,
    };
  }

  if (!outValue) {
    throw new Error("`--out` requires an output file path.");
  }

  return {
    outputPath: path.resolve(process.cwd(), outValue),
  };
}
