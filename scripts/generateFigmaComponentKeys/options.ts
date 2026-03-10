import path from "node:path";

const DEFAULT_OUTPUT_PATH = path.resolve(
  process.cwd(),
  "public/assets/component-keys.json"
);
const OUT_FLAG = "--out";

/**
 * generateFigmaComponentKeysスクリプトのCLIオプション。
 */
export interface GenerateFigmaComponentKeysCliOptions {
  outputPath: string;
}

/**
 * CLI引数を解析し、出力先を絶対パスで返す。
 * `--out` 指定が無い場合はデフォルト出力先を利用する。
 */
export function parseCliOptions(
  argv: string[]
): GenerateFigmaComponentKeysCliOptions {
  const outFlagIndex = argv.indexOf(OUT_FLAG);
  if (outFlagIndex === -1) {
    return { outputPath: DEFAULT_OUTPUT_PATH };
  }

  const outValue = argv[outFlagIndex + 1];
  if (!outValue) {
    throw new Error("`--out` requires an output file path.");
  }

  return { outputPath: path.resolve(process.cwd(), outValue) };
}
