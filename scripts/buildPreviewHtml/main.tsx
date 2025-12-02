import React from "react";
import ReactDOM from "react-dom/client";
import { PreviewPage } from "../../src/mcp/ui/pages/preview";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <PreviewPage />
  </React.StrictMode>
);
