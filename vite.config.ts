import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [svgr()],
  build: {
    rollupOptions: {
      external: ["@ark-ui/react"],
      output: {
        manualChunks: {
          "ark-ui": ["@ark-ui/react"],
        },
      },
    },
  },
});
