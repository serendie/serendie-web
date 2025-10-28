import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  root: resolve(__dirname),
  build: {
    // Output to src/mcp/ui/ instead of dist/ to avoid conflicts with Astro build
    outDir: resolve(__dirname, "../../src/mcp/ui"),
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
      output: {
        entryFileNames: "preview.js",
        assetFileNames: "preview.[ext]",
      },
    },
    // Disable code splitting for single file output
    cssCodeSplit: false,
    // Inline all assets
    assetsInlineLimit: 100000000, // 100MB - inline everything
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "../../src"),
      src: resolve(__dirname, "../../src"),
      "styled-system": resolve(__dirname, "../../styled-system"),
    },
  },
});
