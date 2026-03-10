import type {
  FigmaComponentSetsResponse,
  FigmaComponentsResponse,
  FigmaNodesResponse,
} from "./types";

const FIGMA_API_BASE = "https://api.figma.com/v1";

/**
 * Figma REST APIへリクエストし、失敗時はレスポンス本文を含めて例外化する。
 */
async function figmaRequest<T>(
  token: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${FIGMA_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-FIGMA-TOKEN": token,
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Figma API request failed (${response.status} ${response.statusText}): ${message}`
    );
  }

  return (await response.json()) as T;
}

/**
 * Figmaアクセスに必要な環境変数を解決する。
 * - token: `FIGMA_ACCESS_TOKEN` 系
 * - fileKey: `FIGMA_FILE_KEY` 系
 */
export function resolveFigmaEnv(): {
  token: string;
  fileKey: string;
} | null {
  const token =
    process.env.FIGMA_ACCESS_TOKEN ||
    process.env.PERSONAL_ACCESS_TOKEN ||
    process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY || process.env.FILE_KEY;

  if (!token || !fileKey) {
    return null;
  }

  return { token, fileKey };
}

/**
 * Figmaファイル内のコンポーネント一覧を取得する。
 */
export async function getFileComponents(token: string, fileKey: string) {
  return figmaRequest<FigmaComponentsResponse>(
    token,
    `/files/${fileKey}/components`
  );
}

/**
 * Figmaファイル内のComponent Set一覧を取得する。
 */
export async function getFileComponentSets(token: string, fileKey: string) {
  return figmaRequest<FigmaComponentSetsResponse>(
    token,
    `/files/${fileKey}/component_sets`
  );
}

/**
 * 指定したノードID群の詳細を取得する。
 * nodeIdsが空の場合はAPIを呼ばず、空レスポンス相当を返す。
 */
export async function getFileNodes(
  token: string,
  fileKey: string,
  nodeIds: string[]
) {
  if (nodeIds.length === 0) {
    return { nodes: {} } as FigmaNodesResponse;
  }

  const ids = encodeURIComponent(nodeIds.join(","));
  return figmaRequest<FigmaNodesResponse>(
    token,
    `/files/${fileKey}/nodes?ids=${ids}`
  );
}
