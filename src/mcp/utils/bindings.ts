/// <reference types="@cloudflare/workers-types" />

export interface WorkerBindings {
  CF_ACCOUNT_ID?: string;
  CF_API_TOKEN?: string;
  DOCUMENT_SEARCH_INDEX?: string;
  DOCS_SEARCH_API_ENDPOINT?: string;
  DOCS_SEARCH_API_KEY?: string;
  GUIDELINE_SEARCH?: AiSearchInstanceService;
  DESIGN_DOCS_SEARCH?: AiSearchInstanceService;
  DESIGN_DOCS_DB?: D1Database;
  [key: string]: unknown;
}

const GLOBAL_KEY = "__SERENDIE_WORKER_BINDINGS__";

type GlobalWithBindings = typeof globalThis & {
  [GLOBAL_KEY]?: WorkerBindings;
};

export function setWorkerBindings(env: WorkerBindings): void {
  (globalThis as GlobalWithBindings)[GLOBAL_KEY] = env;
}

export function getBinding<K extends keyof WorkerBindings>(
  key: K
): WorkerBindings[K] | undefined {
  const bindings = (globalThis as GlobalWithBindings)[GLOBAL_KEY];
  return bindings?.[key] as WorkerBindings[K] | undefined;
}

export function getEnvValue(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }

  const bindings = (globalThis as GlobalWithBindings)[GLOBAL_KEY];
  const value = bindings?.[key];
  return typeof value === "string" ? value : undefined;
}
