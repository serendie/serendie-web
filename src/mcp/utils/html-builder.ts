/**
 * Build standalone HTML for OpenAI Apps SDK component preview widget
 * This creates a self-contained HTML document that can be embedded in ChatGPT
 */

interface ComponentData {
  componentName: string;
  samples: Array<{
    name: string;
    path: string;
  }>;
}

export async function buildComponentPreviewHTML(
  data: ComponentData,
  baseUrl?: string
): Promise<string> {
  const { componentName, samples } = data;
  const previewBaseUrl =
    baseUrl || "https://add-openai-apps-sdk.serendie-web.pages.dev";

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${componentName} Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #ffffff;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .header {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
    }

    .header h1 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      flex-wrap: wrap;
    }

    .tab {
      padding: 8px 16px;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      background: #ffffff;
      cursor: pointer;
      font-size: 14px;
      color: #333333;
      transition: all 0.2s;
    }

    .tab:hover {
      background: #f5f5f5;
    }

    .tab.active {
      background: #0353AA;
      color: #ffffff;
      border-color: #0353AA;
    }

    .content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow: auto;
    }

    .preview-frame {
      width: 100%;
      max-width: 1200px;
      border: none;
      min-height: 400px;
    }

    .loading {
      color: #666666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${componentName}</h1>
    <div class="tabs" id="tabs">
      ${samples.map((sample, index) => `<button class="tab ${index === 0 ? "active" : ""}" data-index="${index}">${sample.name}</button>`).join("")}
    </div>
  </div>

  <div class="content">
    <iframe id="preview-frame" class="preview-frame" src="about:blank"></iframe>
  </div>

  <script type="module">
    const samples = ${JSON.stringify(samples)};
    let currentIndex = 0;

    // Load sample in iframe
    function loadSample(index) {
      currentIndex = index;
      const sample = samples[index];
      const iframe = document.getElementById('preview-frame');

      // Update active tab
      document.querySelectorAll('.tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
      });

      // Load the preview URL
      iframe.src = \`${previewBaseUrl}/preview/${componentName}\`;
    }

    // Tab click handlers
    document.getElementById('tabs').addEventListener('click', (e) => {
      if (e.target.classList.contains('tab')) {
        const index = parseInt(e.target.dataset.index);
        loadSample(index);
      }
    });

    // Load first sample on init
    loadSample(0);

    // Listen for messages from parent (OpenAI Apps SDK)
    window.addEventListener('message', (event) => {
      if (event.data.type === 'updateComponent') {
        const { componentName: newComponent, samples: newSamples } = event.data;
        // Handle dynamic component updates if needed
      }
    });
  </script>
</body>
</html>`;
}

// TypeScript global type definitions for OpenAI Apps SDK
declare global {
  interface Window {
    openai?: {
      toolOutput?: {
        componentName?: string;
      };
    };
  }
}

/**
 * Build HTML template for OpenAI Apps SDK component preview widget
 * This is a placeholder that tells ChatGPT to load the actual preview page
 *
 * NOTE: In production, we should either:
 * 1. Return the statically-built HTML from /preview/index.html
 * 2. Or use this placeholder to load it via fetch/iframe
 *
 * For now, this returns a simple message explaining that the preview
 * should be loaded from the /preview/ route
 */
export function buildComponentPreviewTemplate(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Serendie Component Preview</title>
  <meta http-equiv="refresh" content="0;url=/preview/">
</head>
<body>
  <p>Redirecting to component preview...</p>
  <script>
    // Preserve OpenAI context during redirect
    if (window.openai?.toolOutput) {
      sessionStorage.setItem('openai-context', JSON.stringify(window.openai.toolOutput));
    }
    window.location.href = '/preview/';
  </script>
</body>
</html>`;
}
