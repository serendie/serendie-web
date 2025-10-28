import { useSyncExternalStore } from "react";

// OpenAI Apps SDK types
export interface OpenAiGlobals {
  toolInput?: unknown;
  toolOutput?: unknown;
  toolResponseMetadata?: unknown;
  widgetState?: unknown;
}

interface SetGlobalsEvent extends CustomEvent {
  detail: {
    globals: OpenAiGlobals;
  };
}

declare global {
  interface Window {
    openai: OpenAiGlobals & {
      setWidgetState: (state: unknown) => void;
      callTool: (name: string, args: unknown) => Promise<unknown>;
      requestDisplayMode: (mode: string) => void;
      sendFollowUpMessage: (message: string) => void;
    };
  }

  interface WindowEventMap {
    "openai:set_globals": SetGlobalsEvent;
  }
}

/**
 * Subscribe to a single value from window.openai and listen for changes
 * @param key - The key to subscribe to (e.g., "toolOutput", "widgetState")
 * @returns The current value of the key
 */
export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(
  key: K
): OpenAiGlobals[K] {
  return useSyncExternalStore(
    (onChange) => {
      const handleSetGlobal = (event: SetGlobalsEvent) => {
        const value = event.detail.globals[key];
        if (value === undefined) return;
        onChange();
      };
      window.addEventListener("openai:set_globals", handleSetGlobal);
      return () => {
        window.removeEventListener("openai:set_globals", handleSetGlobal);
      };
    },
    () => window.openai?.[key]
  );
}

/**
 * Convenience hook to get the tool output
 */
export function useToolOutput<T = unknown>(): T | undefined {
  return useOpenAiGlobal("toolOutput") as T | undefined;
}

/**
 * Convenience hook to get the widget state
 */
export function useWidgetState<T = unknown>(): T | undefined {
  return useOpenAiGlobal("widgetState") as T | undefined;
}
