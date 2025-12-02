import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    svgr(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          // Content Security Policy for development
          res.setHeader(
            "Content-Security-Policy",
            "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https:; " +
              "font-src 'self' data:; " +
              "connect-src 'self' https://www.google-analytics.com ws://localhost:*; " +
              "frame-src 'self'; " +
              "frame-ancestors 'self' https://chatgpt.com https://*.openai.com https://*.oaistatic.com https://*.oaiusercontent.com;"
          );

          // Other security headers
          res.setHeader("X-Frame-Options", "SAMEORIGIN");
          res.setHeader("X-Content-Type-Options", "nosniff");
          res.setHeader("X-XSS-Protection", "1; mode=block");
          res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

          next();
        });
      },
    },
  ],
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
