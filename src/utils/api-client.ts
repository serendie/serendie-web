import { hc } from "hono/client";
import type { App } from "../pages/api/[...path]";

// Create a typed client for the API
export const createApiClient = (baseUrl?: string) => {
  const url =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return hc<App>(url);
};

// Default client instance for browser usage
export const getApiClient = () => {
  if (typeof window !== "undefined") {
    return createApiClient();
  }
  // For SSR, create a client with the base URL
  return createApiClient("http://localhost:4321");
};

// Type-safe API request examples
export const api = {
  // Get health status
  async getHealth() {
    const res = await fetch("/api/health");
    return res.json();
  },

  // Get version info
  async getVersion() {
    const res = await fetch("/api/version");
    return res.json();
  },

  // Get all components
  async getComponents() {
    const res = await fetch("/api/components");
    return res.json();
  },

  // Get component by ID
  async getComponent(id: string) {
    const res = await fetch(`/api/components/${id}`);
    return res.json();
  },
};
