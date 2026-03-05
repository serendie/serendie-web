import fs from "node:fs/promises";
import path from "node:path";
import type { ComponentKeysMap } from "./types";

/**
 * 出力の差分を安定させるため、コンポーネント名とプロパティ名をソートする。
 */
function normalizeComponentKeys(input: ComponentKeysMap): ComponentKeysMap {
  const sortedEntries = Object.entries(input).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const normalized: ComponentKeysMap = {};
  for (const [name, value] of sortedEntries) {
    normalized[name] = value.componentProperties
      ? {
          ...value,
          componentProperties: [...value.componentProperties].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        }
      : value;
  }

  return normalized;
}

/**
 * component-keysデータをJSONとして保存する。
 * 出力先ディレクトリは存在しない場合に自動作成する。
 */
export async function writeComponentKeysFile(
  outputPath: string,
  componentKeysMap: ComponentKeysMap
) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const normalized = normalizeComponentKeys(componentKeysMap);
  const source = `${JSON.stringify(normalized, null, 2)}\n`;
  await fs.writeFile(outputPath, source, { encoding: "utf-8" });
}
