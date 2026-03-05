import "dotenv/config";
import {
  getFileComponentSets,
  getFileComponents,
  getFileNodes,
  resolveFigmaEnv,
} from "./figma";
import { buildComponentKeysMap } from "./mapper";
import type { FigmaNodeDocument } from "./types";
import { writeComponentKeysFile } from "./store";
import { parseCliOptions } from "./options";
const NODE_FETCH_BATCH_SIZE = 50;

/**
 * ノードID配列を指定サイズで分割する。
 * Figma Nodes APIのURL長制限対策として利用する。
 */
function chunkNodeIds(nodeIds: string[], size: number): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < nodeIds.length; i += size) {
    chunks.push(nodeIds.slice(i, i + size));
  }
  return chunks;
}

/**
 * Component Setノードの詳細をバッチ取得し、nodeIdをキーに再構成する。
 */
async function collectNodeDocumentsById(
  token: string,
  fileKey: string,
  nodeIds: string[]
) {
  const batches = chunkNodeIds([...new Set(nodeIds)], NODE_FETCH_BATCH_SIZE);
  const responses = await Promise.all(
    batches.map((batchIds) => getFileNodes(token, fileKey, batchIds))
  );

  const nodeDocumentsById: Record<string, FigmaNodeDocument | undefined> = {};
  for (const response of responses) {
    for (const [nodeId, nodeData] of Object.entries(response.nodes)) {
      nodeDocumentsById[nodeId] = nodeData.document;
    }
  }

  return nodeDocumentsById;
}

/**
 * CLIエントリポイント。
 * Figmaからデータを取得し、component-keys.jsonを生成する。
 */
async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  const { token, fileKey } = resolveFigmaEnv();

  console.log("Generating component keys from Figma data...");
  const [componentsResponse, componentSetsResponse] = await Promise.all([
    getFileComponents(token, fileKey),
    getFileComponentSets(token, fileKey),
  ]);

  const components = componentsResponse.meta?.components ?? [];
  const componentSets = componentSetsResponse.meta?.component_sets ?? [];
  const componentSetNodeIds = componentSets.map(
    (componentSet) => componentSet.node_id
  );
  const componentNodeIds = components.map((component) => component.node_id);

  console.log("Resolving component property definitions from Figma nodes...");
  const nodeDocumentsById = await collectNodeDocumentsById(token, fileKey, [
    ...componentSetNodeIds,
    ...componentNodeIds,
  ]);

  const componentKeysMap = buildComponentKeysMap({
    componentSets,
    components,
    nodeDocumentsById,
  });

  await writeComponentKeysFile(options.outputPath, componentKeysMap);
  console.log(
    `Generated component key data: ${options.outputPath} (${Object.keys(componentKeysMap).length} components)`
  );
}

main().catch((error) => {
  console.error("Failed to generate component keys from Figma.");
  console.error(error);
  process.exit(1);
});
