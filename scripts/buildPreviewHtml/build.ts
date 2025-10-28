import { build } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFile, rename } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildPreviewHtml() {
  console.log("Building preview HTML...");

  // Run Vite build
  await build({
    configFile: resolve(__dirname, "vite.config.ts"),
    mode: "production",
  });

  console.log("Vite build completed");

  // Rename index.html to preview.html
  const outDir = resolve(__dirname, "../../dist/mcp/ui");
  const indexPath = resolve(outDir, "index.html");
  const previewPath = resolve(outDir, "preview.html");

  try {
    await rename(indexPath, previewPath);
    console.log(`Renamed index.html to preview.html`);
  } catch (error) {
    console.error("Failed to rename output file:", error);
    throw error;
  }

  // Read the generated HTML and verify it's a single file
  const html = await readFile(previewPath, "utf-8");
  const hasExternalAssets = html.includes('src="') || html.includes('href="');

  if (hasExternalAssets) {
    console.warn(
      "Warning: Generated HTML may contain external asset references"
    );
  } else {
    console.log("✓ Generated self-contained HTML file");
  }

  console.log(`\nPreview HTML built successfully at: ${previewPath}`);
}

buildPreviewHtml().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
